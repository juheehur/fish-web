import React from 'react';
import '../styles/Map.css';

const Map = () => {
  return (
    <div className="map-container">
      <div className="map-header">
        <h2>My Map</h2>
      </div>
      <div className="world-map">
        {/* World map with interactive regions will go here */}
      </div>
      <div className="species-list">
        {/* Species list will go here */}
      </div>
    </div>
  );
};

export default Map; 