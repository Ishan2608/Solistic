import React from 'react';

const EventCard = ({ event }) => {
  if (!event) {
    return <div className="event-card empty">Select an event date to view details</div>;
  }

  // Format the date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="event-card">
      <h2 id="event-heading">{event.name}</h2>
      {event.feature_image ? (
        <div className="event-image-container">
          <img 
            id="event-img" 
            src={event.feature_image || event.news_url || '/placeholder-event.jpg'} 
            alt={event.name} 
          />
        </div>
      ) : null}
      <p id="event-para">{event.description}</p>
      <div className="event-details">
        <p><strong>Date:</strong> {formatDate(event.date)}</p>
        {event.location && <p><strong>Location:</strong> {event.location?.name || event.location}</p>}
        {event.type && <p><strong>Type:</strong> {event.type.name}</p>}
      </div>
      <div className="event-actions">
        <button id="event-save-btn" className="button">Save Event</button>
        {event.video_url && (
          <a
            id="event-yt-btn"
            href={event.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="button"
          >
            Watch Video
          </a>
        )}
        {event.news_url && (
          <a
            id="event-news-btn"
            href={event.news_url}
            target="_blank"
            rel="noopener noreferrer"
            className="button"
          >
            Read More
          </a>
        )}
      </div>
    </div>
  );
};

export default EventCard;