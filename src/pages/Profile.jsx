import React, { useState, useEffect } from 'react';
import NewsCard from '../components/News/NewsCard';
import ImageGrid from '../components/ImageGallery/ImageGrid';
import EventCard from '../components/Events/EventCard';

// Sample data (for demo purposes)
const sampleSavedNews = [
  {
    id: 1,
    title: "Mars Rover Discovers New Rock Formation",
    summary: "NASA's Perseverance rover has discovered a unique rock formation that could provide clues about Mars' ancient climate.",
    news_site: "Space.com",
    published_at: new Date().toISOString(),
    url: "#",
    image_url: "https://via.placeholder.com/600x400?text=Mars+Rover"
  },
  {
    id: 2,
    title: "New Exoplanet Could Support Life",
    summary: "Astronomers have discovered an Earth-like exoplanet orbiting in the habitable zone of its star.",
    news_site: "Scientific American",
    published_at: new Date().toISOString(),
    url: "#",
    image_url: "https://via.placeholder.com/600x400?text=Exoplanet"
  },
  {
    id: 1,
    title: "Mars Rover Discovers New Rock Formation",
    summary: "NASA's Perseverance rover has discovered a unique rock formation that could provide clues about Mars' ancient climate.",
    news_site: "Space.com",
    published_at: new Date().toISOString(),
    url: "#",
    image_url: "https://via.placeholder.com/600x400?text=Mars+Rover"
  },
  {
    id: 2,
    title: "New Exoplanet Could Support Life",
    summary: "Astronomers have discovered an Earth-like exoplanet orbiting in the habitable zone of its star.",
    news_site: "Scientific American",
    published_at: new Date().toISOString(),
    url: "#",
    image_url: "https://via.placeholder.com/600x400?text=Exoplanet"
  }
];

const sampleSavedImages = [
  {
    id: "img1",
    url: "https://via.placeholder.com/600x400?text=Galaxy+1",
    title: "Andromeda Galaxy",
    explanation: "The Andromeda Galaxy is the closest spiral galaxy to the Milky Way.",
    date: "2023-09-15"
  },
  {
    id: "img2",
    url: "https://via.placeholder.com/600x400?text=Galaxy+2",
    title: "Whirlpool Galaxy",
    explanation: "The Whirlpool Galaxy is an interacting grand-design spiral galaxy.",
    date: "2023-09-14"
  },
  {
    id: "img1",
    url: "https://via.placeholder.com/600x400?text=Galaxy+1",
    title: "Andromeda Galaxy",
    explanation: "The Andromeda Galaxy is the closest spiral galaxy to the Milky Way.",
    date: "2023-09-15"
  },
  {
    id: "img2",
    url: "https://via.placeholder.com/600x400?text=Galaxy+2",
    title: "Whirlpool Galaxy",
    explanation: "The Whirlpool Galaxy is an interacting grand-design spiral galaxy.",
    date: "2023-09-14"
  }
];

const sampleSavedEvents = [
  {
    name: "Lunar Eclipse 2024",
    description: "Total lunar eclipse visible across North America.",
    feature_image: "https://via.placeholder.com/600x400?text=Lunar+Eclipse",
    date: new Date().toISOString(),
    location: { name: "North America" },
    type: { name: "Eclipse" },
    video_url: "#",
    news_url: "#"
  },
  {
    name: "ISS Spacewalk",
    description: "Two astronauts will conduct a spacewalk outside the International Space Station.",
    feature_image: "https://via.placeholder.com/600x400?text=ISS+Spacewalk",
    date: new Date().toISOString(),
    location: { name: "Low Earth Orbit" },
    type: { name: "Spacewalk" },
    video_url: "#",
    news_url: "#"
  },
  {
    name: "Lunar Eclipse 2024",
    description: "Total lunar eclipse visible across North America.",
    feature_image: "https://via.placeholder.com/600x400?text=Lunar+Eclipse",
    date: new Date().toISOString(),
    location: { name: "North America" },
    type: { name: "Eclipse" },
    video_url: "#",
    news_url: "#"
  },
  {
    name: "ISS Spacewalk",
    description: "Two astronauts will conduct a spacewalk outside the International Space Station.",
    feature_image: "https://via.placeholder.com/600x400?text=ISS+Spacewalk",
    date: new Date().toISOString(),
    location: { name: "Low Earth Orbit" },
    type: { name: "Spacewalk" },
    video_url: "#",
    news_url: "#"
  }
];

const Profile = () => {
  const [savedNews, setSavedNews] = useState(sampleSavedNews);
  const [savedImages, setSavedImages] = useState(sampleSavedImages);
  const [savedEvents, setSavedEvents] = useState(sampleSavedEvents);

  // Placeholder user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    profileImage: "https://via.placeholder.com/150"
  };

  // Toggle save status for news
  const handleSaveNews = (article, isCurrentlySaved) => {
    if (!isCurrentlySaved) {
      setSavedNews((prev) => prev.filter((news) => news.id !== article.id));
    }
  };

  // Toggle save status for images
  const handleSaveImage = (image) => {
    setSavedImages((prev) =>
      prev.filter((img) => img.id !== image.id)
    );
  };

  // Toggle save status for events
  const handleSaveEvent = (event) => {
    setSavedEvents((prev) =>
      prev.filter((ev) => ev.name !== event.name)
    );
  };

  return (
    <div className="profile-page">
      {/* Profile Details Section */}
      <section className="profile-section">
        <div className="profile-container">
          <img src={user.profileImage} alt="Profile" className="profile-image" />
          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-email">{user.email}</p>
        </div>
      </section>

      {/* Saved Events Section */}
      <section className="glass-section">
        <h2 className="section-title">My Saved Events</h2>
        <div className="saved-events-grid">
          {savedEvents.map((event) => (
            <div key={event.name} className="event-card">
              <h2 id="event-heading">{event.name}</h2>
              {event.feature_image && (
                <div className="event-image-container">
                  <img id="event-img" src={event.feature_image} alt={event.name} />
                </div>
              )}
              <p id="event-para">{event.description}</p>
              <div className="event-details">
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                {event.location && <p><strong>Location:</strong> {event.location.name || event.location}</p>}
                {event.type && <p><strong>Type:</strong> {event.type.name}</p>}
              </div>
              <div className="event-actions">
                <button
                  id="event-save-btn"
                  className="button"
                  onClick={() => handleSaveEvent(event)}
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
          ))}
        </div>
      </section>

      {/* Saved Images Section */}
      <section className="glass-section">
        <h2 className="section-title">My Saved Images</h2>
        <div className="image-grid">
          {savedImages.map((image) => (
            <div key={image.id} className="image-item">
              <img src={image.url} alt={image.title || 'Space image'} loading="lazy" />
              <button
                className={`save-button saved`}
                onClick={() => handleSaveImage(image)}
                title="Unsave image"
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
          ))}
        </div>
      </section>

      {/* Saved News Section */}
      <section className="glass-section">
        <h2 className="section-title">My Saved News</h2>
        <div className="saved-news-grid">
          {savedNews.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              onSave={handleSaveNews}
              isSaved={true}
            />
          ))}
        </div>
      </section>


      <style jsx>{`
        /* Styles remain unchanged from previous version */
        .profile-page {
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

        .saved-events-grid,
        .saved-news-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(280px, 1fr));
          gap: 2rem;
          justify-content: center;
        }

        @media (max-width: 768px) {
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
        }

        @media (max-width: 480px) {
          .profile-section,
          .glass-section {
            margin: 1.5rem 1rem;
          }

          .section-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;