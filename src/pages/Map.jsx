import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../styles/Map.css';
import { getLocationImage } from '../services/imageApi';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Map = () => {
  const [viewMode, setViewMode] = useState('community');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [locationImages, setLocationImages] = useState({});
  const [imageLoadError, setImageLoadError] = useState({});
  const [likes, setLikes] = useState({});
  const [reviews, setReviews] = useState({});
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [newReview, setNewReview] = useState({ comment: '', rating: 5 });
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(3);

  const communityMarkers = [
    { 
      position: [-18.2871, 147.6992], 
      name: "Great Barrier Reef",
      animals: ["Clownfish", "Sea Turtles", "Manta Rays"],
      visits: 1205,
      likes: 856,
      reviews: [
        { user: "Emma", comment: "Amazing coral formations! Saw lots of clownfish.", rating: 5, date: "2024-02-15" },
        { user: "John", comment: "Water was crystal clear. Perfect for snorkeling.", rating: 5, date: "2024-02-10" }
      ],
      recentVisitors: ["Alex", "Maria", "James"]
    },
    { 
      position: [20.6330, -156.4940], 
      name: "Molokini Crater",
      animals: ["Parrotfish", "Moray Eels", "Reef Sharks"],
      visits: 890,
      likes: 720,
      reviews: [
        { user: "Sarah", comment: "The reef sharks were incredible!", rating: 5, date: "2024-02-12" }
      ],
      recentVisitors: ["Sarah", "Mike", "Lisa"]
    },
    { 
      position: [17.2056, -87.4920], 
      name: "Belize Barrier Reef",
      animals: ["Nurse Sharks", "Stingrays", "Barracudas"]
    },
    { 
      position: [-0.2320, 130.5061], 
      name: "Raja Ampat",
      animals: ["Manta Rays", "Pygmy Seahorses", "Coral"]
    },
    { 
      position: [64.2557, -21.1234], 
      name: "Silfra Fissure",
      animals: ["Arctic Char", "Algae Gardens"]
    },
    { 
      position: [5.2558, 73.0086], 
      name: "Maldives (Baa Atoll)",
      animals: ["Whale Sharks", "Manta Rays", "Butterflyfish"]
    },
    { 
      position: [21.2690, -157.6935], 
      name: "Hanauma Bay",
      animals: ["Green Sea Turtles", "Triggerfish"]
    },
    { 
      position: [11.9983, 120.2157], 
      name: "Palawan (Coron)",
      animals: ["Dugongs", "Sea Stars", "Reef Fish"]
    },
    { 
      position: [-0.8293, -89.4176], 
      name: "Galapagos Islands",
      animals: ["Sea Lions", "Marine Iguanas", "Penguins"]
    },
    { 
      position: [27.9158, 34.3299], 
      name: "Red Sea (Sharm El-Sheikh)",
      animals: ["Moray Eels", "Lionfish", "Napoleon Wrasse"]
    }
  ];
  
  const myMarkers = [
    { 
      position: [8.6725, 97.6440], 
      name: "Similan Islands",
      animals: ["Whale Sharks", "Barracudas", "Manta Rays"]
    }
  ];

  const markers = viewMode === 'community' ? communityMarkers : myMarkers;

  // Fetch images for markers
  useEffect(() => {
    const fetchImages = async () => {
      const allMarkers = [...communityMarkers, ...myMarkers];
      const images = {};
      
      for (const marker of allMarkers) {
        // Always try to fetch a new image from Pixabay
        const imageUrl = await getLocationImage(marker.name);
        if (imageUrl) {
          images[marker.name] = imageUrl;
        }
      }
      
      if (Object.keys(images).length > 0) {
        setLocationImages(prev => ({ ...prev, ...images }));
      }
    };

    fetchImages();
  }, []); // Run only once when component mounts

  // Component to fit bounds
  const SetBoundsComponent = ({ markers }) => {
    const map = useMap();
    
    React.useEffect(() => {
      if (markers.length > 0) {
        if (markers === myMarkers) {
          // For My Spots view, zoom to Similan Islands
          map.setView([8.6725, 97.6440], 5);
        } else {
          // For community view, keep the existing bounds logic
          const belizeMarker = markers.find(m => m.name === "Belize Barrier Reef");
          const silfraMarker = markers.find(m => m.name === "Silfra Fissure");
          
          if (belizeMarker && silfraMarker) {
            const bounds = L.latLngBounds([
              belizeMarker.position,
              silfraMarker.position
            ]);
            map.fitBounds(bounds, { 
              padding: [20, 30], 
              maxZoom: 4
            });
          }
        }
      }
    }, [markers]);

    return null;
  };

  // Component to handle map center and zoom
  const MapController = () => {
    const map = useMap();
    
    React.useEffect(() => {
      if (mapCenter) {
        map.flyTo(mapCenter, mapZoom, {
          duration: 1.5,  // Animation duration in seconds
          easeLinearity: 0.25
        });
      }
    }, [mapCenter, mapZoom]);

    return null;
  };

  // Image error handler
  const handleImageError = (markerName) => {
    setImageLoadError(prev => ({
      ...prev,
      [markerName]: true
    }));
  };

  // Handle like
  const handleLike = (markerName) => {
    setLikes(prev => ({
      ...prev,
      [markerName]: (prev[markerName] || 0) + 1
    }));
  };

  // Handle review submission
  const handleReviewSubmit = (markerName) => {
    if (newReview.comment.trim()) {
      const review = {
        user: "You",
        ...newReview,
        date: new Date().toISOString().split('T')[0]
      };

      setReviews(prev => ({
        ...prev,
        [markerName]: [...(prev[markerName] || []), review]
      }));

      setNewReview({ comment: '', rating: 5 });
      setShowReviewForm(false);
    }
  };

  // Handle marker click
  const handleMarkerClick = (position) => {
    setMapCenter(position);
    setMapZoom(6);  // Zoom level when marker is clicked
  };

  // Handle view mode change
  const handleViewModeChange = () => {
    const newMode = viewMode === 'community' ? 'my page' : 'community';
    setViewMode(newMode);
    
    if (newMode === 'my page' && myMarkers.length > 0) {
      // Move to my spot
      setMapCenter(myMarkers[0].position);
      setMapZoom(5);
    } else {
      // Move to community view (Belize and Silfra view)
      const belizeMarker = communityMarkers.find(m => m.name === "Belize Barrier Reef");
      const silfraMarker = communityMarkers.find(m => m.name === "Silfra Fissure");
      
      if (belizeMarker && silfraMarker) {
        const centerLat = (belizeMarker.position[0] + silfraMarker.position[0]) / 2;
        const centerLng = (belizeMarker.position[1] + silfraMarker.position[1]) / 2;
        setMapCenter([centerLat, centerLng]);
        setMapZoom(3);
      }
    }
  };

  return (
    <div className="map-page">
      <div className="toggle-container">
        <button 
          className="view-toggle"
          onClick={handleViewModeChange}
        >
          {viewMode === 'community' ? 'My Spots' : 'Community'}
        </button>
      </div>

      <button 
        className="locations-panel-button"
        onClick={() => setIsPanelOpen(true)}
      >
        Show Locations
      </button>

      <div className={`locations-panel ${isPanelOpen ? 'open' : ''}`}>
        <div className="panel-header">
          <h2>{viewMode === 'community' ? 'Snorkeling Locations' : 'My Spots'}</h2>
          <button 
            className="close-panel"
            onClick={() => setIsPanelOpen(false)}
          >
            ×
          </button>
        </div>
        <ul className="location-list">
          {markers.map((marker, idx) => (
            <li key={idx} className="location-card">
              {locationImages[marker.name] && !imageLoadError[marker.name] && (
                <div className="location-image">
                  <img 
                    src={locationImages[marker.name]}
                    alt={marker.name}
                    onError={() => handleImageError(marker.name)}
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '8px 8px 0 0',
                      marginBottom: '12px'
                    }}
                  />
                </div>
              )}
              <div className="location-content">
                <div className="location-title">{marker.name}</div>
                {marker.animals && (
                  <div className="location-details">
                    {marker.animals.join(' • ')}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="map-container">
        <MapContainer 
          center={[45, -40]} 
          zoom={3} 
          style={{ height: '100%', width: '100%' }}
          minZoom={2}
          maxZoom={6}
          worldCopyJump={true}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <SetBoundsComponent markers={markers} />
          <MapController />
          {markers.map((marker, idx) => (
            <Marker 
              key={idx} 
              position={marker.position}
              eventHandlers={{
                click: () => handleMarkerClick(marker.position)
              }}
            >
              <Popup>
                <div className="popup-content">
                  {locationImages[marker.name] && !imageLoadError[marker.name] && (
                    <div className="popup-image">
                      <img 
                        src={locationImages[marker.name]}
                        alt={marker.name}
                        onError={() => handleImageError(marker.name)}
                      />
                    </div>
                  )}
                  <div className="popup-info">
                    <h3 className="popup-title">{marker.name}</h3>
                    <div className="popup-stats">
                      <span>👥 {marker.visits || 0} visits</span>
                      <span onClick={() => handleLike(marker.name)} style={{ cursor: 'pointer' }}>
                        ❤️ {(marker.likes || 0) + (likes[marker.name] || 0)}
                      </span>
                    </div>
                    {marker.animals && (
                      <>
                        <strong className="popup-subtitle">Marine Life</strong>
                        <ul className="popup-list">
                          {marker.animals.map((animal, i) => (
                            <li key={i} className="popup-list-item">{animal}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    <div className="popup-reviews">
                      <strong className="popup-subtitle">Recent Reviews</strong>
                      {marker.reviews && marker.reviews.map((review, i) => (
                        <div key={i} className="review-item">
                          <div className="review-header">
                            <span className="review-user">{review.user}</span>
                            <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
                          </div>
                          <p className="review-comment">{review.comment}</p>
                          <span className="review-date">{review.date}</span>
                        </div>
                      ))}
                      {reviews[marker.name]?.map((review, i) => (
                        <div key={`user-${i}`} className="review-item">
                          <div className="review-header">
                            <span className="review-user">{review.user}</span>
                            <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
                          </div>
                          <p className="review-comment">{review.comment}</p>
                          <span className="review-date">{review.date}</span>
                        </div>
                      ))}
                      <button 
                        className="add-review-button"
                        onClick={() => {
                          setSelectedLocation(marker.name);
                          setShowReviewForm(true);
                        }}
                      >
                        Add Review
                      </button>
                      {showReviewForm && selectedLocation === marker.name && (
                        <div className="review-form">
                          <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                            placeholder="Write your review..."
                          />
                          <div className="review-form-footer">
                            <select
                              value={newReview.rating}
                              onChange={(e) => setNewReview(prev => ({ ...prev, rating: Number(e.target.value) }))}
                            >
                              {[5,4,3,2,1].map(num => (
                                <option key={num} value={num}>{num} ⭐</option>
                              ))}
                            </select>
                            <button onClick={() => handleReviewSubmit(marker.name)}>Submit</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map; 