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
          <Link to="/" id="nav-logo-link" className={`centered ${location.pathname === "/" ? "active" : ""}`}>    
            <img id="nav-logo-img" src="src/assets/logo.png" alt="Logo" />
          </Link>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="menu hidden md:block">
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
          <button className="hidden md:block">
            <Link
              to="/auth"
            >
              Sign In
            </Link>
          </button>
          <Link to="/profile" className="centered">
            <FontAwesomeIcon 
              icon="fa-user" 
              className="hidden md:block cursor-pointer hover:text-blue-400 transition-colors" 
              aria-label="Go to profile"
            />
          </Link>
          <FontAwesomeIcon 
            icon={isMobileMenuOpen ? faTimes : faBars}
            className="hamburger-icon cursor-pointer text-2xl md:text-lg" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          />
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}>
          <div 
            className="mobile-menu-container" 
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside menu
          >
            <div className="mobile-menu-header">
              <FontAwesomeIcon 
                icon={faTimes}
                className="close-icon" 
                onClick={closeMobileMenu}
                aria-label="Close menu"
              />
            </div>
            {/* Mobile Navigation Links */}
            <ul className="mobile-menu-links">
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
              {/* Mobile Sign In Button */}
              <li className="mobile-sign-in">
                <Link to="/auth" onClick={closeMobileMenu}>
                  Sign In
                </Link>
              </li>
              {/* Mobile Profile Button */}
              <li className="mobile-profile">
                <Link to="/profile" onClick={closeMobileMenu}>
                  <FontAwesomeIcon icon="fa-user" className="mr-2" />
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* CSS for the mobile menu */}
      <style jsx>{`
        /* Mobile Menu Overlay */
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          z-index: 998;
          display: flex;
          justify-content: flex-end;
        }
        
        .mobile-menu-container {
          background-color: #1a1a1a;
          width: 80%;
          max-width: 300px;
          height: 100%;
          padding: 2rem 1rem;
          overflow-y: auto;
          animation: slideIn 0.3s ease-out;
          z-index: 999;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-left: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .mobile-menu-header {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 2rem;
        }
        
        .close-icon {
          color: #e0e0e0;
          font-size: 1.5rem;
          cursor: pointer;
          transition: color 0.2s;
        }
        
        .close-icon:hover {
          color: #00aaff;
        }
        
        .mobile-menu-links {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          list-style-type: none;
          padding: 0;
          margin: 0;
        }
        
        .mobile-menu-links li {
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .mobile-menu-links li a {
          display: block;
          font-size: 1.1rem;
          color: #e0e0e0;
          text-decoration: none;
          transition: color 0.2s;
        }
        
        .mobile-menu-links li a.active {
          font-weight: bold;
          color: #00aaff;
        }
        
        .mobile-sign-in {
          margin-top: 1.5rem;
          padding: 0.75rem 1rem;
          background-color: #00aaff;
          border-radius: 4px;
          text-align: center;
          border: none;
          box-shadow: 0 0 15px rgba(0, 170, 255, 0.3);
        }
        
        .mobile-sign-in a {
          color: white !important;
          font-weight: bold;
        }
        
        .mobile-profile {
          margin-top: 1rem;
          padding: 0.75rem 1rem;
          background-color: #333;
          border-radius: 4px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: background-color 0.2s;
        }
        
        .mobile-profile:hover {
          background-color: #444;
        }
        
        .mobile-profile a {
          color: white !important;
          font-weight: bold;
        }
        
        /* Responsive adjustments */
        @media (min-width: 768px) {
          .hamburger-icon {
            display: none;
          }
        }
        
        @media (max-width: 767px) {
          .menu {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

export default Navigation;