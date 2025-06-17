import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const { register, login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      if (isSignUp) {
        // Call Firebase register function with email, password, and username
        const result = await register(
          formData.email,
          formData.password,
          formData.username
        );
        
        if (result.success) {
          // Registration successful, redirect to home
          navigate("/profile");
        } else {
          setError(result.error || "Registration failed");
        }
      } else {
        // Call Firebase login function with email and password
        const result = await login(
          formData.email,
          formData.password
        );
        
        if (result.success) {
          // Login successful, redirect to home
          navigate("/profile");
        } else {
          setError(result.error || "Login failed");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      
      // Handle specific Firebase errors
      if (error.code) {
        switch (error.code) {
          case "auth/email-already-in-use":
            setError("Email already in use");
            break;
          case "auth/invalid-email":
            setError("Invalid email address");
            break;
          case "auth/weak-password":
            setError("Password should be at least 6 characters");
            break;
          case "auth/user-not-found":
            setError("User not found");
            break;
          case "auth/wrong-password":
            setError("Incorrect password");
            break;
          default:
            setError("Something went wrong. Please try again.");
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="form-box">
        <h2>👋 {isSignUp ? "Create Account" : "Welcome Back"}</h2>
        <p>{isSignUp ? "Sign up to get started" : "Sign in to access your account"}</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
          {isSignUp && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
            />
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : (isSignUp ? "Blast Away" : "Sign In")}
          </button>
        </form>

        <div className="toggle">
          {isSignUp ? (
            <p>
              Already have an account?{" "}
              <span onClick={() => setIsSignUp(false)}>Sign In</span>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <span onClick={() => setIsSignUp(true)}>Sign Up</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}