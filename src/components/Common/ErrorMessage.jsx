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

  return (
    <div className={`error-container ${visible ? 'error-visible' : ''}`}>
      <div className="error-content">
        <div className="error-icon-container">
          <AlertTriangle size={48} className="error-icon" />
          <div className="error-pulse"></div>
        </div>
        <div className="error-message-container">
          <h3 className="error-title">Houston, we have a problem</h3>
          <p className="error-text">{message || 'An unknown error occurred'}</p>
          <div className="error-stars">
            {[...Array(50)].map((_, i) => (
              <div 
                key={i} 
                className="error-star"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
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