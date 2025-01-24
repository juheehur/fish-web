import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../styles/Map.css';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Map = () => {
  const [viewMode, setViewMode] = useState('community');
  
  // Example data - replace with your actual data
  const communityMarkers = [
    { position: [51.505, -0.09], name: "Community Fish Spot 1" },
    { position: [51.51, -0.1], name: "Community Fish Spot 2" },
  ];
  
  const myMarkers = [
    { position: [51.515, -0.09], name: "My Fish Spot 1" },
  ];

  const markers = viewMode === 'community' ? communityMarkers : myMarkers;

  return (
    <div className="map-container">
      <div className="map-header">
        <button 
          onClick={() => setViewMode(prev => prev === 'community' ? 'my page' : 'community')}
          style={{
            padding: '8px 16px',
            marginBottom: '10px',
            cursor: 'pointer',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          {viewMode === 'community' ? 'Switch to My Page' : 'Switch to Community'}
        </button>
        <h2>{viewMode === 'community' ? 'Community Map' : 'My Map'}</h2>
      </div>

      <MapContainer 
        center={[51.505, -0.09]} 
        zoom={13} 
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((marker, idx) => (
          <Marker key={idx} position={marker.position}>
            <Popup>{marker.name}</Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="species-list">
        <h3>{viewMode === 'community' ? 'Community Fish Spots' : 'My Fish Spots'}</h3>
        <ul>
          {markers.map((marker, idx) => (
            <li key={idx}>{marker.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Map; 