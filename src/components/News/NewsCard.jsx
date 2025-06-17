import React from 'react';

// NewsCard Component - Displays individual news article
const NewsCard = ({ article, onSave, isSaved, isLoading = false }) => {
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
                        className={`save-button ${isSaved ? 'saved' : ''} ${isLoading ? 'loading' : ''}`}
                        title={isSaved ? 'Remove from saved' : 'Save for later'}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <svg
                                width="20"
                                height="20"
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
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill={isSaved ? '#ff6b6b' : 'none'}
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                            </svg>
                        )}
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
                            className={`save-button-text ${isSaved ? 'saved' : ''} ${isLoading ? 'loading' : ''}`}
                            title={isSaved ? 'Remove from saved' : 'Save for later'}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <svg
                                    width="16"
                                    height="16"
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
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill={isSaved ? '#ff6b6b' : 'none'}
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                </svg>
                            )}
                            {isLoading ? 'Saving...' : (isSaved ? 'Saved' : 'Save')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsCard;