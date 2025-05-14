import React, { useState, useEffect } from 'react';
import ImageTabs from './ImageTab';
import ImageGrid from './ImageGrid';
import * as spaceAPI from '../../api/spaceAPI';

const ImageGallerySection = () => {
  const [activeTab, setActiveTab] = useState('spacex');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  // Format data from API responses into a consistent structure for the ImageGrid
  const formatImages = (data, type) => {
    switch (type) {
      case 'spacex':
        return data.flatMap(launch => 
          launch.links.flickr.original.map((url, index) => ({
            id: `${launch.id}-${index}`,
            url,
            title: launch.name,
            date: new Date(launch.date_utc).toLocaleDateString(),
            explanation: launch.details || 'No details available'
          }))
        );

      case 'marsrover':
        return data.map(photo => ({
          id: photo.id,
          url: photo.img_src,
          title: `${photo.rover.name} - ${photo.camera.full_name}`,
          date: photo.earth_date,
          explanation: `Taken by ${photo.rover.name} rover using ${photo.camera.full_name} camera on Sol ${photo.sol}`
        }));

      case 'nasa':
        return data.map(item => {
          const imageData = item.links?.[0] || {};
          const metadata = item.data?.[0] || {};
          
          return {
            id: metadata.nasa_id || `nasa-${Math.random()}`,
            url: imageData.href || '',
            title: metadata.title || 'NASA Image',
            date: metadata.date_created || '',
            explanation: metadata.description || 'No description available'
          };
        });

      case 'apod':
        return [{
          id: 'apod',
          url: data.url,
          title: data.title,
          date: data.date,
          explanation: data.explanation,
          copyright: data.copyright
        }];

      default:
        return [];
    }
  };

  // Fetch images based on active tab
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let data;
        
        switch (activeTab) {
          case 'spacex':
            data = await spaceAPI.fetchSpaceXImages();
            setImages(formatImages(data, 'spacex'));
            break;
            
          case 'marsrover':
            data = await spaceAPI.fetchMarsRoverImages();
            setImages(formatImages(data, 'marsrover'));
            break;
            
          case 'nasa':
            data = await spaceAPI.fetchNASAImages(searchQuery || 'galaxy');
            setImages(formatImages(data, 'nasa'));
            break;
            
          case 'apod':
            data = await spaceAPI.fetchAPOD();
            setImages(formatImages(data, 'apod'));
            break;
            
          default:
            setImages([]);
        }
      } catch (err) {
        console.error(`Error fetching ${activeTab} images:`, err);
        setError(`Failed to load ${activeTab} images. Please try again later.`);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [activeTab, searchQuery]);

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // If NASA tab is active, trigger a new search
    if (activeTab === 'nasa') {
      const query = e.target.search.value.trim();
      setSearchQuery(query);
    }
  };

  return (
    <div className="image-gallery-section">
      <ImageTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'nasa' && (
        <div className="search-container">
          <form onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              name="search" 
              placeholder="Search NASA images..." 
              className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
          </form>
        </div>
      )}
      
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <ImageGrid images={images} loading={loading} />
      )}
    </div>
  );
};

export default ImageGallerySection;