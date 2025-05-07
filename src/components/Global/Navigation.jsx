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
    { path: "/auth", name: "Auth" },
    { path: "/news", name: "News" },
    { path: "/image-gallery", name: "Image Gallery" },
    { path: "/solar-system-simulator", name: "Solar System Simulator" },
    { path: "/tutor", name: "Tutor" }
  ];

  return (
    <>
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
        <div>
          <button>Sign In</button>
          <FontAwesomeIcon icon="fa-user" />
          <FontAwesomeIcon 
            icon={faBars} 
            className="hamburger-icon" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          />
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="logo-container">
            <img id="nav-logo-img" src="src/assets/logo.png" alt="Logo" />
          </div>
          <button 
            className="mobile-menu-close" 
            onClick={closeMobileMenu}
            aria-label="Close mobile menu"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <ul>
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link 
                to={link.path} 
                className={location.pathname === link.path ? "active" : ""}
                onClick={closeMobileMenu}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/sign-in" onClick={closeMobileMenu}>
              Sign In
            </Link>
          </li>
        </ul>
      </div>

      {/* Backdrop */}
      <div 
        className={`backdrop ${isMobileMenuOpen ? 'open' : ''}`} 
        onClick={closeMobileMenu}
      ></div>
    </>
  );
}

export default Navigation;