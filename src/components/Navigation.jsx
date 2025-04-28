import React from "react";
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <nav>
      {/* Navigation Logo */}
      <div>
        <img src="/logo.png" alt="Logo" />
      </div>

      {/* Navigation Links */}
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/auth">Auth</Link>
          </li>
          <li>
            <Link to="/news">News</Link>
          </li>
          <li>
            <Link to="/image-gallery">Image Gallery</Link>
          </li>
          <li>
            <Link to="/solar-system-simulator">Solary System Simulator</Link>
          </li>
          <li>
            <Link to="/tutor">Tutor</Link>
          </li>
        </ul>
      </div>

      {/* Sign-Up Button */}
      <div>
        <button>Sign Up/Login</button>
      </div>
    </nav>
  );
}

export default Navigation;
