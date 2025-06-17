import React from 'react';
import LoadingSpinner from '../Common/LoadingSpinner';
const ImageGrid = ({ images, loading, onToggleSave, savedImages }) => {
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

  return (
    <div className="image-grid">
      {images.map((image, index) => (
        <div 
          // Use image.id as key if available, fallback to index for stability
          // Add a unique prefix to index to avoid potential conflicts if image.id is undefined/null frequently
          key={`${image.id || index}`} 
          className="image-item"
        >
          <img 
            src={image.url} 
            alt={image.title || 'Space image'} 
            loading="lazy"
          />
          <button 
            // Determine if the current image is saved by checking its id against the savedImages array from AuthContext
            className={`save-button ${savedImages.some(savedImage => savedImage.id === image.id) ? 'saved' : ''}`}
            onClick={() => onToggleSave(image)} // Call the passed toggle function
            title={savedImages.some(savedImage => savedImage.id === image.id) ? 'Remove from saved' : 'Save image'}
          >
            {/* Using an SVG icon for the save button */}
            <svg 
              viewBox="0 0 24 24" 
              fill={savedImages.some(savedImage => savedImage.id === image.id) ? '#ff6b6b' : 'none'}
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