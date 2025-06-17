import React from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import NewsCard from '../components/News/NewsCard';
import LoadingSpinner from '../components/Common/LoadingSpinner'; // Assuming you have a LoadingSpinner component

const Profile = () => {
  // Get user data and saved items from AuthContext
  const { user, isLoading, savedNews, savedImages, savedEvents, removeSavedNews, removeSavedImage, removeSavedEvent } = useAuth();

  // Check if loading or user is null, display a loading message
  if (isLoading) {
    return <LoadingSpinner />; // Or any other loading indicator
  }

  if (!user) {
    // Redirect to login page or show a message if not logged in
    // You might want to use navigate here if not handled by your routing
    return <div className="not-logged-in-message">Please log in to view your profile.</div>;
  }

  // Functions to handle unsaving items
  const handleUnsaveImage = async (image) => {
    // Ensure user and image.id exist before calling removeSavedImage
    if (user && image && image.id) {
      await removeSavedImage(image.id);
    }
  };

  const handleUnsaveEvent = async (event) => {
    // Assuming event has a unique identifier, like 'id' or 'name' (as used in AuthContext)
    // Based on AuthContext, it seems 'id' is used for removal, let's use that if available, otherwise 'name'
    if (user && event) {
       const itemId = event.id || event.name; // Use ID if available, otherwise name
       if(itemId) {
           await removeSavedEvent(itemId);
       }
    }
  };

  const handleUnsaveNews = async (article) => {
    // Ensure user and article.id exist before calling removeSavedNews
    if (user && article && article.id) {
      await removeSavedNews(article.id);
    }
  };

  return (
    <div className="profile-page">
      {/* Profile Details Section */}
      <section className="profile-section">
        <div className="profile-container">
          {/* You might need to add a profile image field to your user schema if you want to display one */}
          {/* Display username if available, otherwise email */}
          <h1 className="profile-name">{user.username || user.email}</h1>
          <p className="profile-email">{user.email}</p>
        </div>
      </section>

      {/* Saved Events Section */}
      <section className="glass-section">
        <h2 className="section-title">My Saved Events</h2>
        <div className="saved-events-grid">
          {savedEvents && savedEvents.length > 0 ? (
            savedEvents.map((event) => (
              <div key={event.id || event.name} className="event-card"> {/* Use ID or name as key */}
                <h2 id="event-heading">{event.name}</h2>
                {event.feature_image && (
                  <div className="event-image-container">
                    <img id="event-img" src={event.feature_image} alt={event.name} />
                  </div>
                )}
                <p id="event-para">{event.description}</p>
                <div className="event-details">
                  <p><strong>Date:</strong> {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}</p>
                  {event.location && <p><strong>Location:</strong> {event.location.name || event.location}</p>}
                  {event.type && <p><strong>Type:</strong> {event.type.name}</p>}
                </div>
                <div className="event-actions">
                  <button
                    id="event-save-btn"
                    className="button"
                    onClick={() => handleUnsaveEvent(event)} // Call handleUnsaveEvent
                  >
                    Unsave
                  </button>
                  {event.video_url && (
                    <a id="event-yt-btn" href={event.video_url} target="_blank" rel="noopener noreferrer" className="button">
                      Watch Video
                    </a>
                  )}
                  {event.news_url && (
                    <a id="event-news-btn" href={event.news_url} target="_blank" rel="noopener noreferrer" className="button">
                      Read More
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No saved events yet.</p>
          )}
        </div>
      </section>

      {/* Saved Images Section */}
      <section className="glass-section">
        <h2 className="section-title">My Saved Images</h2>
        <div className="image-grid">
          {savedImages && savedImages.length > 0 ? (
            savedImages.map((image) => (
              <div key={image.id} className="image-item">
                <img src={image.url} alt={image.title || 'Space image'} loading="lazy" />
                <button
                  className={`save-button saved`}
                  onClick={() => handleUnsaveImage(image)} // Call handleUnsaveImage
                  title="Remove image"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff6b6b" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
                <div className="image-overlay">
                  <h3>{image.title || 'Untitled'}</h3>
                  {image.date && <p className="image-date">{image.date}</p>}
                  {image.explanation && (
                    <p className="image-description-preview">
                      {image.explanation.length > 100 ? `${image.explanation.substring(0, 100)}...` : image.explanation}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No saved images yet.</p>
          )}
        </div>
      </section>

      {/* Saved News Section */}
      <section className="glass-section">
        <h2 className="section-title">My Saved News</h2>
        <div className="saved-news-grid">
          {savedNews && savedNews.length > 0 ? (
            savedNews.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                onSave={() => handleUnsaveNews(article)} // Call handleUnsaveNews
                isSaved={true}
              />
            ))
          ) : (
             <p>No saved news yet.</p>
          )}
        </div>
      </section>

      <style jsx>{`
        .profile-page {
        .loading-message {\n
          text-align: center;\n
          font-size: 1.5rem;\n
          color: #e0e0e0;\n
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f1a, #1a1a2e);
          color: #e0e0e0;
          font-family: 'Poppins', sans-serif;
          padding: 2rem 1rem 4rem;
        }

        .profile-section {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          margin: 2rem auto;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          text-align: center;
          width: 100%;
          max-width: 1400px;
        }

        .profile-image {
          width: 140px;
          height: 140px;
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid #4db5ff;
          box-shadow: 0 0 15px rgba(77, 181, 255, 0.4);
        }

        .profile-name {
          margin-top: 1rem;
          font-size: 2rem;
          color: white;
        }

        .profile-email {
          font-size: 1rem;
          color: #aaa;
        }

        .glass-section {
          backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 2rem;
          margin: 2rem auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 100%;
          max-width: 1400px;
        }

        .section-title {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 2rem;
          color: #ffffff;
          position: relative;
          display: inline-block;
        }

        .section-title::after {
          content: '';
          display: block;
          width: 60px;
          height: 3px;
          margin: 0.5rem auto;
          background: linear-gradient(to right, transparent, #4db5ff, transparent);
        }

        /* Responsive Grid Layout */
        .saved-events-grid,
        .saved-news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          justify-content: center;
        }

        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
        }

        /* Responsive Event Card */
        .event-card {
          background-color: #1e1e1e;
          border: 1px solid #333;
          border-radius: 10px;
          padding: 1.5rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .event-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(77, 181, 255, 0.2);
        }

        .event-image-container img {
          width: 100%;
          height: auto;
          border-radius: 8px;
          object-fit: cover;
          max-height: 200px;
        }

        /* Responsive Image Item */
        .image-item {
          position: relative;
          overflow: hidden;
          border-radius: 10px;
          background-color: #1e1e1e;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          transition: transform 0.3s ease;
        }

        .image-item:hover {
          transform: scale(1.03);
        }

        .image-item img {
          width: 100%;
          height: auto;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .image-item:hover img {
          transform: scale(1.05);
        }

        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1rem;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          color: white;
          opacity: 1;
          transition: all 0.3s ease;
        }

        .image-overlay h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: bold;
        }

        .image-description-preview {
          font-size: 0.8rem;
          color: #d0d0d0;
        }

        /* Responsive News Cards */
        .news-card {
          background: #1e1e1e;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          transition: transform 0.3s ease;
        }

        .news-card:hover {
          transform: translateY(-5px);
        }

        .news-card-image img {
          width: 100%;
          height: auto;
          aspect-ratio: 16 / 9;
          object-fit: cover;
        }

        .news-card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
        }

        .news-source {
          color: #64ffda;
          font-weight: 600;
        }

        .news-date {
          color: #888;
          font-size: 0.75rem;
        }

        .news-card-title {
          font-size: 1.1rem;
          margin: 0.5rem 0 1rem;
          color: #fff;
        }

        .news-card-summary {
          font-size: 0.85rem;
          color: #ccc;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Responsive Buttons */
        .save-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.7);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .save-button.saved {
          background: rgba(255, 107, 107, 0.2);
          color: #ff6b6b;
        }

        /* Responsive Design Breakpoints */

        @media (max-width: 960px) {
          .saved-events-grid,
          .saved-news-grid {
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          }

          .profile-name {
            font-size: 1.75rem;
          }

          .profile-email {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 768px) {
          .glass-section {
            padding: 1.5rem;
          }

          .profile-section,
          .glass-section {
            margin: 1.5rem 1rem;
            padding: 1.5rem;
          }

          .profile-image {
            width: 120px;
            height: 120px;
          }

          .section-title {
            font-size: 1.75rem;
          }

          .news-card-title {
            font-size: 1rem;
          }

          .news-card-summary {
            font-size: 0.8rem;
          }

          .event-card {
            padding: 1.2rem;
          }

          .event-image-container img {
            max-height: 160px;
          }
        }

        @media (max-width: 480px) {
          .profile-section,
          .glass-section {
            margin: 1.5rem auto;
            padding: 1.2rem 1rem;
            width: calc(100% - 2rem);
            max-width: 100%;
          }

          .profile-page {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .section-title {
            font-size: 1.5rem;
          }

          .section-title::after {
            width: 50px;
          }

          .saved-events-grid,
          .saved-news-grid,
          .image-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .profile-image {
            width: 100px;
            height: 100px;
          }

          .profile-name {
            font-size: 1.5rem;
          }

          .profile-email {
            font-size: 0.85rem;
          }

          .news-card-meta {
            font-size: 0.75rem;
          }

          .news-card-title {
            font-size: 1rem;
          }

          .news-card-summary {
            display: none;
          }

          .event-card {
            padding: 1rem;
          }

          .event-image-container img {
            max-height: 140px;
          }
        }
        .loading-message, .not-logged-in-message {
          text-align: center;
          font-size: 1.5rem;
          color: #e0e0e0;
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default Profile;