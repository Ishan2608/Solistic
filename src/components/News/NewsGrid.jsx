// src/components/News/NewsGrid.js
import React, { useState, useEffect } from 'react';
import { fetchMultipleNews } from '../../api/spaceAPI';
import { truncateText } from '../../utils/helpers';

export const NewsGrid = ({ limit = 10 }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const newsData = await fetchMultipleNews(limit);
        setArticles(newsData);
        setError(null);
      } catch (err) {
        setError('Failed to load news articles. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [limit]);

  if (loading) return <div className="loading">Loading news articles...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!articles.length) return <div className="no-news">No news articles available at the moment.</div>;

  return (
    <div className="news-grid">
      {articles.map((article) => (
        <div key={article.id} className="news-item">
          <h3>{article.title}</h3>
          <img 
            src={article.image_url || "/placeholder-image.jpg"} 
            alt={article.title} 
          />
          <p>{truncateText(article.summary, 30)}</p>
          <p className="news-source">Source: {article.news_site}</p>
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="button"
          >
            Read Full Article
          </a>
        </div>
      ))}
    </div>
  );
};