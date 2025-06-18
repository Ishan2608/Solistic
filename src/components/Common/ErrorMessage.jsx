import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';


const ErrorMessage = ({ message }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    setVisible(true);
    
    // Optional: Auto-dismiss after a certain period
    // const timer = setTimeout(() => setVisible(false), 10000);
    // return () => clearTimeout(timer);
  }, []);

  // This component displays an error message with a visual flair.
  // The 'error-container' div acts as the main wrapper for the error message.
  return (
    <div className={`error-container ${visible ? 'error-visible' : ''}`}>
      <div className="error-content">
        <div className="error-icon-container">
          <AlertTriangle size={48} className="error-icon" />
          <div className="error-pulse"></div>
        </div>
        <div className="error-message-container">
          {/* Fixed error title */}
          <h3 className="error-title">Houston, we have a problem</h3>
          {/* Display the actual error message passed as a prop */}
          <p className="error-text">{message || 'An unknown error occurred'}</p>
          {/* Container for the animated "stars" */}
          <div className="error-stars">
            {/* Generate 50 star elements */}
            {[...Array(50)].map((_, i) => (
              <div 
                key={i} 
                className="error-star"
                style={{
                  // Random horizontal position for the star (0% to 100%)
                  left: `${Math.random() * 100}%`,
                  // Random vertical position for the star (0% to 100%)
                  top: `${Math.random() * 100}%`,
                  // Random animation delay for each star to create a twinkling effect
                  animationDelay: `${Math.random() * 10}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;