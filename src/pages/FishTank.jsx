import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import '../styles/FishTank.css';

const FishTank = () => {
  const [collectedFish, setCollectedFish] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCollectedFish = async () => {
      try {
        // Load all scanned fish from Firebase
        const fishRef = collection(db, 'scannedFish');
        const q = query(fishRef, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const fishData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()
        }));
        setCollectedFish(fishData);
      } catch (error) {
        console.error('Error loading fish collection:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCollectedFish();
  }, []);

  if (loading) {
    return (
      <div className="fishtank-container">
        <div className="tank-header">
          <h2>My Fish Collection</h2>
        </div>
        <div className="loading">Loading your fish collection...</div>
      </div>
    );
  }

  if (collectedFish.length === 0) {
    return (
      <div className="fishtank-container">
        <div className="tank-header">
          <h2>My Fish Collection</h2>
        </div>
        <div className="empty-tank">
          <div className="empty-message">
            <h3>Your tank is empty!</h3>
            <p>Start collecting fish by scanning them with the camera 📸</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fishtank-container">
      <div className="tank-header">
        <h2>My Fish Collection</h2>
        <div className="collection-stats">
          <span>{collectedFish.length} fish collected</span>
        </div>
      </div>
      <div className="tank-view">
        <div className="tank-background" />
        <div className="fish-collection">
          {collectedFish.map((fish) => (
            <div key={fish.id} className="fish-item collected">
              <div className="fish-image-container">
                <img 
                  src={fish.imageUrl} 
                  alt="Collected fish"
                  className="fish-image"
                />
              </div>
              <div className="fish-info">
                <div className="fish-header">
                  <span className="capture-date">
                    Captured: {fish.timestamp?.toLocaleDateString()}
                  </span>
                </div>
                <p className="fish-description">{fish.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FishTank; 