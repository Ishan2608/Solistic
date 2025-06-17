import React, { useState } from "react";
import "./Auth.css";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log(isSignUp ? "Registering..." : "Logging in...", formData);
    // Add actual API call or auth logic here
  };

  return (
    <div className="auth-container">
      <div className="form-box">
        <h2>👋 {isSignUp ? "Create Account" : "Welcome Back"}</h2>
        <p>{isSignUp ? "Sign up to get started" : "Sign in to access your account"}</p>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
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
          />
          {isSignUp && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          )}

          <button type="submit">{isSignUp ? "Blast Away" : "Sign In"}</button>
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