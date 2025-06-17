import React, { useState, useEffect } from "react";
import Header from "../components/Common/Header";
import ErrorMessage from "../components/Common/ErrorMessage";
import LoadingSpinner from "../components/Common/LoadingSpinner";

import { useAuth } from "../context/AuthContext";
import NewsCard from "../components/News/NewsCard";
import FeaturedNews from "../components/News/FeaturedNews";

import { fetchMultipleNews, fetchLatestNews } from "../api/spaceAPI";

const HEADER_TITLE = "Space पत्रिका";
const HEADER_PARA = "Stay updated on all stars through the cosmos.";
const HEADER_BG_URL = "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

// Main News Component
const News = () => {
  const [featuredNews, setFeaturedNews] = useState(null);
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveLoading, setSaveLoading] = useState(null); // Track which article is being saved
  
  const { user, savedNews, saveNews, removeSavedNews, isNewsSaved, isLoading: authLoading } = useAuth();

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
      console.error('Error loading news data:', err);
      setError(err.message || 'Failed to load space news');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadNewsData();
  }, []);

  // Function to handle saving/unsaving articles
  const handleToggleSaveNews = async (article) => {
    if (!user) {
      alert("Please log in to save news.");
      return;
    }

    // Prevent multiple clicks while saving
    if (saveLoading === article.id) {
      return;
    }

    try {
      setSaveLoading(article.id);
      
      const isArticleSaved = isNewsSaved(article.id);
      let success = false;

      if (isArticleSaved) {
        success = await removeSavedNews(article.id);
        if (success) {
          console.log('Successfully removed article from saved:', article.title);
        }
      } else {
        success = await saveNews(article);
        if (success) {
          console.log('Successfully saved article:', article.title);
        }
      }

      // Show user feedback
      if (!success) {
        alert(isArticleSaved ? 'Failed to remove article from saved' : 'Failed to save article');
      }

    } catch (error) {
      console.error('Error toggling save status:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSaveLoading(null);
    }
  };

  // Retry function for error handling
  const handleRetry = () => {
    loadNewsData();
  };

  // Helper function to check if article is saved (with loading state consideration)
  const getIsSaved = (articleId) => {
    if (authLoading || !user) return false;
    return isNewsSaved(articleId);
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
                onSave={handleToggleSaveNews}
                isSaved={getIsSaved(featuredNews.id)}
                isLoading={saveLoading === featuredNews.id}
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
                    onSave={handleToggleSaveNews}
                    isSaved={getIsSaved(article.id)}
                    isLoading={saveLoading === article.id}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default News;