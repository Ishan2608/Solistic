import React, { useState, useEffect } from "react";
import Header from "../components/Common/Header";
import ErrorMessage from "../components/Common/ErrorMessage";
import LoadingSpinner from "../components/Common/LoadingSpinner";

import { fetchMultipleNews, fetchLatestNews } from "../api/spaceAPI"; // Adjust import path as needed

const HEADER_TITLE = "Space पत्रिका";
const HEADER_PARA = "Stay updated on all stars through the cosmos.";
const HEADER_BG_URL = "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

// NewsCard Component - Displays individual news article
const NewsCard = ({ article, onSave, isSaved }) => {
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
    onSave(article);
  };

  return (
    <div className="news-card">
      {article.image_url && (
        <div className="news-card-image">
          <img 
            src={article.image_url} 
            alt={article.title}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <button 
            onClick={handleSave}
            className={`save-button ${isSaved ? 'saved' : ''}`}
            title={isSaved ? 'Remove from saved' : 'Save for later'}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill={isSaved ? '#ff6b6b' : 'none'} 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>
      )}
      <div className="news-card-content">
        <div className="news-card-meta">
          <span className="news-source">{article.news_site}</span>
          <span className="news-date">{formatDate(article.published_at)}</span>
        </div>
        <h3 className="news-card-title">{article.title}</h3>
        <p className="news-card-summary">{article.summary}</p>
        <div className="news-card-actions">
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="news-card-link"
          >
            Read Full Article →
          </a>
          {!article.image_url && (
            <button 
              onClick={handleSave}
              className={`save-button-text ${isSaved ? 'saved' : ''}`}
              title={isSaved ? 'Remove from saved' : 'Save for later'}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill={isSaved ? '#ff6b6b' : 'none'} 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              {isSaved ? 'Saved' : 'Save'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Featured News Component - Displays the latest/featured article
const FeaturedNews = ({ article, onSave, isSaved }) => {
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
              className={`featured-save-button ${isSaved ? 'saved' : ''}`}
              title={isSaved ? 'Remove from saved' : 'Save for later'}
            >
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill={isSaved ? '#ff6b6b' : 'none'} 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              {isSaved ? 'Saved' : 'Save for Later'}
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

// Main News Component
const News = () => {
  const [featuredNews, setFeaturedNews] = useState(null);
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedArticles, setSavedArticles] = useState([]);

  // Function to load all news data
  const loadNewsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both featured news and multiple articles concurrently
      const [featured, articles] = await Promise.all([
        fetchLatestNews(),
        fetchMultipleNews(12) // Fetch 12 articles for the grid
      ]);
      
      setFeaturedNews(featured);
      // Filter out the featured article from the grid to avoid duplication
      const filteredArticles = articles.filter(article => article.id !== featured?.id);
      setNewsArticles(filteredArticles.slice(0, 9)); // Show 9 articles in grid
      
    } catch (err) {
      setError(err.message || 'Failed to load space news');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadNewsData();
    // Load saved articles from memory (in a real app, this would be from your backend/database)
    loadSavedArticles();
  }, []);

  // Function to load saved articles (placeholder - replace with actual API call)
  const loadSavedArticles = () => {
    // In a real application, you would fetch this from your backend
    // For now, we'll use an empty array
    setSavedArticles([]);
  };

  // Function to handle saving/unsaving articles
  const handleSaveArticle = (article) => {
    setSavedArticles(prev => {
      const isAlreadySaved = prev.some(saved => saved.id === article.id);
      
      if (isAlreadySaved) {
        // Remove from saved articles
        const updatedSaved = prev.filter(saved => saved.id !== article.id);
        // Here you would make an API call to remove from backend
        console.log('Removing article from saved:', article.title);
        return updatedSaved;
      } else {
        // Add to saved articles
        const updatedSaved = [...prev, article];
        // Here you would make an API call to save to backend
        console.log('Saving article:', article.title);
        return updatedSaved;
      }
    });
  };

  // Function to check if an article is saved
  const isArticleSaved = (articleId) => {
    return savedArticles.some(saved => saved.id === articleId);
  };

  // Retry function for error handling
  const handleRetry = () => {
    loadNewsData();
  };

  return (
    <div className="news-page">
      <Header 
        title={HEADER_TITLE}
        paragraph={HEADER_PARA}
        backgroundImage={HEADER_BG_URL}
      />
      
      <main className="news-content">
        {loading && <LoadingSpinner />}
        
        {error && !loading && (
          <ErrorMessage message={error} onRetry={handleRetry} />
        )}
        
        {!loading && !error && (
          <>
            {featuredNews && (
              <FeaturedNews 
                article={featuredNews} 
                onSave={handleSaveArticle}
                isSaved={isArticleSaved(featuredNews.id)}
              />
            )}
            
            <section className="news-grid-section">
              <div className="section-header">
                <h2>More Space News</h2>
                <p>Discover the latest developments in space exploration</p>
              </div>
              
              <div className="news-grid">
                {newsArticles.map((article) => (
                  <NewsCard 
                    key={article.id} 
                    article={article} 
                    onSave={handleSaveArticle}
                    isSaved={isArticleSaved(article.id)}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
      
      <style jsx>{`
        .news-page {
          min-height: 100vh;
          background: #0a0a0a;
          color: #ffffff;
        }

        .news-content {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Featured News Styles */
        .featured-news {
          margin: 3rem 0;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .featured-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          padding: 3rem;
          align-items: center;
        }

        .featured-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .featured-badge {
          background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: bold;
          text-transform: uppercase;
        }

        .featured-source {
          color: #64ffda;
          font-weight: 600;
        }

        .featured-date {
          color: #888;
          font-size: 0.9rem;
        }

        .featured-title {
          font-size: 2.5rem;
          font-weight: bold;
          margin: 1rem 0;
          line-height: 1.2;
          background: linear-gradient(45deg, #fff, #64ffda);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .featured-summary {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #ccc;
          margin: 1.5rem 0;
        }

        .featured-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          padding: 1rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .featured-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
        }

        .featured-image {
          position: relative;
          border-radius: 15px;
          overflow: hidden;
        }

        .featured-image img {
          width: 100%;
          height: 300px;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .featured-image:hover img {
          transform: scale(1.05);
        }

        /* Section Header */
        .section-header {
          text-align: center;
          margin: 4rem 0 2rem 0;
        }

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          background: linear-gradient(45deg, #fff, #64ffda);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-header p {
          color: #888;
          font-size: 1.1rem;
        }

        /* News Grid Styles */
        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin: 2rem 0;
        }

        .news-card {
          background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
          border-radius: 15px;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid #333;
        }

        .news-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
          border-color: #64ffda;
        }

        .news-card-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .news-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .news-card:hover .news-card-image img {
          transform: scale(1.1);
        }

        .news-card-content {
          padding: 1.5rem;
        }

        .news-card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .news-source {
          color: #64ffda;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .news-date {
          color: #888;
          font-size: 0.8rem;
        }

        .news-card-title {
          font-size: 1.3rem;
          font-weight: bold;
          margin: 0.5rem 0 1rem 0;
          line-height: 1.3;
          color: #fff;
        }

        .news-card-summary {
          color: #ccc;
          line-height: 1.5;
          margin-bottom: 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .news-card-link {
          color: #64ffda;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .news-card-link:hover {
          color: #fff;
          transform: translateX(5px);
        }

        .news-card-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        /* Save Button Styles */
        .save-button {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.7);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          color: #fff;
        }

        .save-button:hover {
          background: rgba(0, 0, 0, 0.9);
          transform: scale(1.1);
        }

        .save-button.saved {
          background: rgba(255, 107, 107, 0.2);
          color: #ff6b6b;
        }

        .save-button.saved:hover {
          background: rgba(255, 107, 107, 0.3);
        }

        .save-button-text {
          background: rgba(100, 255, 218, 0.1);
          border: 1px solid #64ffda;
          color: #64ffda;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .save-button-text:hover {
          background: rgba(100, 255, 218, 0.2);
          transform: translateY(-1px);
        }

        .save-button-text.saved {
          background: rgba(255, 107, 107, 0.1);
          border-color: #ff6b6b;
          color: #ff6b6b;
        }

        .save-button-text.saved:hover {
          background: rgba(255, 107, 107, 0.2);
        }

        /* Featured Save Button */
        .featured-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .featured-save-button {
          background: rgba(100, 255, 218, 0.1);
          border: 1px solid #64ffda;
          color: #64ffda;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .featured-save-button:hover {
          background: rgba(100, 255, 218, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(100, 255, 218, 0.2);
        }

        .featured-save-button.saved {
          background: rgba(255, 107, 107, 0.1);
          border-color: #ff6b6b;
          color: #ff6b6b;
        }

        .featured-save-button.saved:hover {
          background: rgba(255, 107, 107, 0.2);
          box-shadow: 0 10px 20px rgba(255, 107, 107, 0.2);
        }

        /* Loading Styles */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          color: #64ffda;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid #333;
          border-top: 3px solid #64ffda;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Error Styles */
        .error-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 4rem;
        }

        .error-content {
          text-align: center;
          background: #2d1b1b;
          padding: 2rem;
          border-radius: 15px;
          border: 1px solid #ff6b6b;
        }

        .error-content h3 {
          color: #ff6b6b;
          margin-bottom: 1rem;
        }

        .error-content p {
          color: #ccc;
          margin-bottom: 2rem;
        }

        .retry-button {
          background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .retry-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(255, 107, 107, 0.4);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .news-content {
            padding: 1rem;
          }

          .featured-content {
            grid-template-columns: 1fr;
            padding: 2rem;
            text-align: center;
          }

          .featured-title {
            font-size: 2rem;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .news-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .news-card-content {
            padding: 1rem;
          }
        }

        @media (max-width: 480px) {
          .featured-title {
            font-size: 1.5rem;
          }

          .section-header h2 {
            font-size: 1.8rem;
          }

          .featured-actions {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .featured-save-button {
            justify-content: center;
          }

          .news-card-actions {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .save-button-text {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default News;