import React from 'react';
import '../styles/Research.css';

const Research = () => {
  return (
    <div className="research-container">
      <div className="research-header">
        <h2>Research Mission</h2>
      </div>
      <div className="missions-list">
        <div className="mission-card">
          <h3>Coral Bleaching Monitoring Mission</h3>
          <div className="mission-progress">
            <div className="progress-bar">
              <span className="progress" style={{ width: '58.6%' }}></span>
            </div>
            <span className="score">58.6</span>
          </div>
        </div>
        {/* More mission cards will go here */}
      </div>
    </div>
  );
};

export default Research; 