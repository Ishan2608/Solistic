import React from 'react';

// Featured News Component - Displays the latest/featured article
const FeaturedNews = ({ article, onSave, isSaved, isLoading = false }) => {
  const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
      });
  };

  const handleSave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isLoading) return; // Prevent clicks while loading
      onSave(article);
  };

  if (!article) return null;

  return (
      <div className="featured-news">
          <div className="featured-content">
              <div className="featured-text">
                  <div className="featured-meta">
                      <span className="featured-badge">Latest News</span>
                      <span className="featured-source">{article.news_site}</span>
                      <span className="featured-date">{formatDate(article.published_at)}</span>
                  </div>
                  <h2 className="featured-title">{article.title}</h2>
                  <p className="featured-summary">{article.summary}</p>
                  <div className="featured-actions">
                      <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="featured-link"
                      >
                          Read Full Story →
                      </a>
                      <button
                          onClick={handleSave}
                          className={`featured-save-button ${isSaved ? 'saved' : ''} ${isLoading ? 'loading' : ''}`}
                          title={isSaved ? 'Remove from saved' : 'Save for later'}
                          disabled={isLoading}
                      >
                          {isLoading ? (
                              <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  className="spinner"
                              >
                                  <circle
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      fill="none"
                                      strokeDasharray="31.416"
                                      strokeDashoffset="31.416"
                                      style={{
                                          animation: 'spin 1s linear infinite'
                                      }}
                                  />
                              </svg>
                          ) : (
                              <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill={isSaved ? '#ff6b6b' : 'none'}
                                  stroke="currentColor"
                                  strokeWidth="2"
                              >
                                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                              </svg>
                          )}
                          {isLoading ? 'Saving...' : (isSaved ? 'Saved' : 'Save for Later')}
                      </button>
                  </div>
              </div>
              {article.image_url && (
                  <div className="featured-image">
                      <img
                          src={article.image_url}
                          alt={article.title}
                          onError={(e) => {
                              e.target.style.display = 'none';
                          }}
                      />
                  </div>
              )}
          </div>
      </div>
  );
};

export default FeaturedNews;