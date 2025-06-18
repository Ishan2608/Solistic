import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function AuthPage() {
  // State to toggle between sign-up and sign-in forms
  const [isSignUp, setIsSignUp] = useState(false);

  // State to hold form input data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // State to hold any error messages
  const [error, setError] = useState("");

  // Get authentication functions and loading state from AuthContext
  const { register, login, isLoading } = useAuth();

  // Get navigation function from react-router-dom
  const navigate = useNavigate();

  // Handle input changes and update form data state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing in any field
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password length
    // Minimum password length check
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // If in sign-up mode, check if passwords match
    if (isSignUp && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      if (isSignUp) {
        // If it's a sign-up attempt, call the register function
        const result = await register(
          formData.email,
          formData.password,
          formData.username
        );
        
        if (result.success) {
          // Registration successful, redirect to profile page
          navigate("/profile");
        } else {
          setError(result.error || "Registration failed");
        }
      } else {
        // If it's a sign-in attempt, call the login function
        const result = await login(
          formData.email,
          formData.password
        );
        
        if (result.success) {
          // Login successful, redirect to home
          navigate("/"); // Redirect to home page after successful login
        } else {
          setError(result.error || "Login failed");
        }
      }
    } catch (error) { // Catch any errors during the authentication process
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

  // Render the authentication form
  return (
    // Main container for the authentication page
    <div className="auth-container">
      {/* Box containing the form */}
      <div className="form-box">
        {/* Dynamic heading based on whether it's sign-up or sign-in */}
        <h2>👋 {isSignUp ? "Create Account" : "Welcome Back"}</h2>
        {/* Dynamic subheading */}
        <p>{isSignUp ? "Sign up to get started" : "Sign in to access your account"}</p>

        {/* Display error message if there is one */}
        {error && <div className="error-message">{error}</div>}

        {/* The authentication form */}
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
          {/* Email input field */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            // Password input field
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
              // Confirm password input field (only shown during sign-up)
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