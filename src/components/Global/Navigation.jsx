import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'; // Added faTimes
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-solid-svg-icons';

library.add(faUser, faBars, faTimes);

function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Prevent scrolling on body when menu is open
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : '';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  // Navigation links array for DRY code
  const navLinks = [
    { path: "/", name: "Home" },
    { path: "/news", name: "News" },
    { path: "/image-gallery", name: "Image Gallery" },
    { path: "/solar-system-simulator", name: "Solar System Simulator" },
    { path: "/tutor", name: "Tutor" }
  ];

  return (
    <>
      <nav className="row between-center">
        {/* Navigation Logo */}
        <div className="logo-container">
          <Link to="/" id="nav-logo-link" className={`centered location.pathname === "/" ? "active" : ""`}>    
            <img id="nav-logo-img" src="src/assets/logo.png" alt="Logo" />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="menu">
          <ul className="row even-center">
            {navLinks.map((link) => (
              <li key={link.path} className="centered">
                <Link 
                  to={link.path} 
                  className={location.pathname === link.path ? "active" : ""}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Sign-Up Button */}
        <div className="nav-right row even-center">
          <button>
            <Link
              to="/auth"
            >
              Sign In
            </Link>

          </button>
          <FontAwesomeIcon icon="fa-user" />
          <FontAwesomeIcon 
            icon={faBars}
            className="hamburger-icon" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          />
        </div>
      </nav>
    </>
  );
}

export default Navigation;