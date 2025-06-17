import React, { useState } from 'react';
import LoadingSpinner from '../Common/LoadingSpinner';

const ImageGrid = ({ images, loading }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner message="Loading images..." />
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="no-images">
        <p>No images available. Please try another category.</p>
      </div>
    );
  }

  // Simple state to manage saved status for demonstration
  // In a real application, this would likely be managed globally or with a backend
  const [savedImagesState, setSavedImagesState] = useState({});


  return (
    <div className="image-grid">
      {images.map((image, index) => (
        <div 
          key={`${image.id || index}`} 
          className="image-item"
        >
          <img 
            src={image.url} 
            alt={image.title || 'Space image'} 
            loading="lazy"
          />
          <button 
            className={`save-button ${savedImagesState[image.id] ? 'saved' : ''}`}
            onClick={() => {
              // Toggle saved state for this image
              setSavedImagesState(prevState => ({
                ...prevState,
                [image.id]: !prevState[image.id]
              }));
            }}>
            {/* Using an SVG icon for the save button */}
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill={savedImagesState[image.id] ? '#ff6b6b' : 'none'} 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          <div className="image-overlay">
            <h3>{image.title || 'Untitled'}</h3>
            {image.date && <p className="image-date">{image.date}</p>}
            {image.explanation && (
              <p className="image-description-preview">
                {image.explanation.length > 100 
                  ? `${image.explanation.substring(0, 100)}...` 
                  : image.explanation}
              </p>
            )}
            
          </div>
        </div>
      ))}
    </div>
  );
};


export default ImageGrid;