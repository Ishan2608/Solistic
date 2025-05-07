import React, { useState, useEffect } from 'react';
import { fetchAPOD } from '../api/spaceAPI';
import LoadingSpinner from './common/LoadingSpinner';

function APOD() {
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAPOD = async () => {
      try {
        const data = await fetchAPOD();
        setApodData(data);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    getAPOD();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;
  if (!apodData) return null;

  return (
    <div className="apod-container">
      <div className="apod-image-container">
        <img
          src={apodData.url}
          alt={apodData.title}
          className="apod-image"
        />
      </div>
      <div className="apod-details">
        <h2 className="apod-title">Astronomy Picture of the Day</h2>
        <h3 className="apod-title">{apodData.title}</h3>
        <p className="apod-date">{apodData.date}</p>
        <p className="apod-explanation">{apodData.explanation}</p>
        <p className="apod-copyright">
          {apodData.copyright && `Copyright: ${apodData.copyright}`}
        </p>
      </div>
    </div>
  );
}

export default APOD;
