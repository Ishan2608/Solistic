import React, { useState, useEffect } from 'react';
import { fetchAPOD } from '../api/spaceAPI';
import LoadingSpinner from './Common/LoadingSpinner';
import ErrorMessage from './Common/ErrorMessage';
import { truncateText } from '../utility/helpers';

function APOD() {
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const getAPOD = async () => {
      // Reset states at the beginning of each fetch attempt
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchAPOD();
        if (!data) {
          throw new Error('No data received from NASA API');
        }
        setApodData(data);
        setLoading(false);
      } catch (err) {
        console.error('APOD Error:', err);
        setError(err.message || 'An error occurred loading the astronomy picture');
        setLoading(false);
        // Clear any potential partial data on error
        setApodData(null);
      }
    };

    getAPOD();
  }, []);

  // Order of conditionals matters here
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />; // Using our new ErrorMessage component
  if (!apodData) return null;

  return (
    <div className='apod-sect'>
      <h1 className="txt-lg apod-sect-title">
        Astronomy Picture of the Day
      </h1>
      <div className="apod-container">
        <div className="apod-image-container">
          <img
            src={apodData.url}
            alt={apodData.title}
            className="apod-image"
          />
        </div>
        <div className="apod-details">
          <h3 className="txt-lg">{apodData.title}</h3>
          <p className="apod-date">{apodData.date}</p>
          <p className="apod-explanation">
            {expanded ? apodData.explanation : truncateText(apodData.explanation, 300)}
            {apodData.explanation.length > 300 && (
              <button onClick={() => setExpanded(!expanded)} className="read-more-btn">
                {expanded ? 'Read Less' : 'Read More'}
              </button>
            )}</p>
          <p className="apod-copyright">
            {apodData.copyright && `Copyright: ${apodData.copyright}`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default APOD;