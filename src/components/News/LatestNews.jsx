// src/components/News/LatestNews.js
import React, { useState, useEffect } from 'react';
import { fetchLatestNews } from '../../api/spaceAPI';

const LatestNews = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLatestNews = async () => {
      try {
        setLoading(true);
        const newsData = await fetchLatestNews();
        setArticle(newsData);
        setError(null);
      } catch (err) {
        setError('Failed to load the latest news. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLatestNews();
  }, []);

  if (loading) return <div className="loading">Loading latest news...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!article) return <div className="no-news">No news available at the moment.</div>;

  return (
    <div className="latest-news">
      <h2 id="news-heading">{article.title}</h2>
      <h3 id="news-credit">Credit: {article.news_site}</h3>
      <img 
        id="news-image" 
        src={article.image_url || "/placeholder-image.jpg"} 
        alt={article.title} 
      />
      <p id="news-description">{article.summary}</p>
      <a 
        id="open-latest-news-article" 
        href={article.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="button"
      >
        Read Full Article
      </a>
    </div>
  );
};

export default LatestNews;