import React from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-solid-svg-icons';


library.add(faUser,faBars)

function Navigation() {
  const location = useLocation(); // Get current location
  return (
    <nav>
      {/* Navigation Logo */}
      <div className="logo-container">
        <Link to="/" id="nav-logo-link" className={location.pathname === "/" ? "active" : ""}>    
          <img id="nav-logo-img" src="src/assets/logo.png" alt="Logo" />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="menu">
        <ul className="row-even-center">
          <li className="centered">
            {/* Apply active class conditionally */}
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>
          </li>
          <li className="centered">
            {/* Apply active class conditionally */}
            <Link to="/auth" className={location.pathname === "/auth" ? "active" : ""}>
              Auth
            </Link>
          </li>
          <li className="centered">
            {/* Apply active class conditionally */}
            <Link to="/news" className={location.pathname === "/news" ? "active" : ""}>
              News
            </Link>
          </li>
          <li className="centered">
            {/* Apply active class conditionally */}
            <Link to="/image-gallery" className={location.pathname === "/image-gallery" ? "active" : ""}>
              Image Gallery
            </Link>
          </li>
          <li className="centered">
            {/* Apply active class conditionally */}
            <Link to="/solar-system-simulator" className={location.pathname === "/solar-system-simulator" ? "active" : ""}>
              Solary System Simulator
            </Link>
          </li>
          <li className="centered">
            {/* Apply active class conditionally */}
            <Link to="/tutor" className={location.pathname === "/tutor" ? "active" : ""}>
              Tutor
            </Link>
          </li>
        </ul>
      </div>

      {/* Sign-Up Button */}
      <div>
        <button>Sign In</button>
        <FontAwesomeIcon icon="fa-user" />
        <FontAwesomeIcon icon={faBars} className="hamburger-icon" />
      </div>
    </nav>
  );
}

export default Navigation;