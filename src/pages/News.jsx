import React, { useState, useEffect } from 'react';
import { getSnorkelingNews } from '../services/newsApi';
import '../styles/News.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const articles = await getSnorkelingNews();
        setNews(articles);
      } catch (error) {
        console.error('Error loading news:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  return (
    <div className="news-container">
      <div className="news-header">
        <h2>Snorkeling News</h2>
      </div>
      
      {loading ? (
        <div className="loading">Loading news...</div>
      ) : (
        <div className="news-list">
          {news.map((article, index) => (
            <a 
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="news-card"
            >
              {article.imageUrl && (
                <div className="news-image">
                  <img src={article.imageUrl} alt={article.title} />
                </div>
              )}
              <div className="news-content">
                <h3>{article.title}</h3>
                <p className="news-description">{article.description}</p>
                <div className="news-meta">
                  <span className="news-source">{article.source}</span>
                  <span className="news-date">
                    {article.publishedAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default News; 