import React, { useState, useEffect } from "react";
import Header from "../components/Common/Header";
import ErrorMessage from "../components/Common/ErrorMessage";
import LoadingSpinner from "../components/Common/LoadingSpinner";

import NewsCard from "../components/News/NewsCard";
import FeaturedNews from "../components/News/FeaturedNews";

import { fetchMultipleNews, fetchLatestNews } from "../api/spaceAPI"; // Adjust import path as needed

const HEADER_TITLE = "Space पत्रिका";
const HEADER_PARA = "Stay updated on all stars through the cosmos.";
const HEADER_BG_URL = "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";



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

    </div>
  );
};

export default News;