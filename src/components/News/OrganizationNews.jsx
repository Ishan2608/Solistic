import React, { useState, useEffect } from 'react';
import { fetchOrganizationNews } from '../../api/spaceAPI';

export const OrganizationNews = ({ organization }) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrganizationNews = async () => {
      try {
        setLoading(true);
        const newsData = await fetchOrganizationNews(organization);
        setArticle(newsData);
        setError(null);
      } catch (err) {
        setError(`Failed to load ${organization} news. Please try again.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadOrganizationNews();
  }, [organization]);

  if (loading) return <div className="loading">Loading {organization} news...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!article) return <div className="no-news">No {organization} news available at the moment.</div>;

  const newsCardId = `news-${organization.toLowerCase()}`;

  return (
    <div className="organization-news-card" id={newsCardId}>
      <h2 id={`${newsCardId}-heading`}>{article.title}</h2>
      <img 
        id={`${newsCardId}-img`}
        src={article.image_url || "/placeholder-image.jpg"} 
        alt={article.title} 
      />
      <p id={`${newsCardId}-para`}>{article.summary}</p>
      <p id={`${newsCardId}-img-credit`}>Credit: {article.news_site}</p>
      <a 
        id={`${newsCardId}-btn`}
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