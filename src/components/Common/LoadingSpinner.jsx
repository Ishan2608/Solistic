import React from 'react';

// LoadingSpinner component displays a loading spinner with an optional message.
const LoadingSpinner = ({ message = 'Loading...' }) => {
  // message prop is used to display a custom loading message.
  // It defaults to 'Loading...' if no message is provided.

  return (
    <div className="loading-spinner">
      <div>
        <div className="spinner"></div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;