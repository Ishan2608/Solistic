import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/gallery.css';

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