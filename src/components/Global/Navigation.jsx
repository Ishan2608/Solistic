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
          <FontAwesomeIcon icon="fa-user" className="hidden md:block" />
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
                  <FontAwesomeIcon icon="fa-user" className="mr-2" />
                  Sign In
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
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
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
          background-color: #007bff;
          border-radius: 4px;
          text-align: center;
        }
        
        .mobile-sign-in a {
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