import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navigation.css';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
        <i className="nav-icon camera-icon"></i>
      </Link>
      <Link to="/map" className={`nav-item ${location.pathname === '/map' ? 'active' : ''}`}>
        <i className="nav-icon map-icon"></i>
      </Link>
      <Link to="/fishtank" className={`nav-item ${location.pathname === '/fishtank' ? 'active' : ''}`}>
        <i className="nav-icon tank-icon"></i>
      </Link>
      <Link to="/news" className={`nav-item ${location.pathname === '/news' ? 'active' : ''}`}>
        <i className="nav-icon news-icon"></i>
      </Link>
      <Link to="/research" className={`nav-item ${location.pathname === '/research' ? 'active' : ''}`}>
        <i className="nav-icon research-icon"></i>
      </Link>
    </nav>
  );
};

export default Navigation; 