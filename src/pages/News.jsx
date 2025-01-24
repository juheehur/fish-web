import React, { useState, useEffect } from 'react';
import { getNews, searchNews } from '../services/newsApi';
import '../styles/News.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const articles = await getNews();
        setNews(articles);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch news');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const results = await searchNews(searchTerm);
      setNews(results);
    } catch (error) {
      setError('Failed to search news');
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="loading">Loading news...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="news-container">
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search news..."
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>

      <div className="news-grid">
        {news.map((article, index) => (
          <div key={index} className="news-card" onClick={() => window.open(article.url, '_blank')}>
            <div className="news-image">
              <img 
                src={article.urlToImage || 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80'} 
                alt={article.title} 
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>
            <div className="news-content">
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <div className="news-meta">
                <span>{article.source.name}</span>
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News; 