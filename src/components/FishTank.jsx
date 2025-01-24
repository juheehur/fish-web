import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Aquarium } from './Aquarium';

const Container = styled.div`
  min-height: 100vh;
  background: #FFFFFF;
  padding: 20px;
  padding-bottom: 80px;
`;

const Header = styled.div`
  padding: 32px 0;
  text-align: left;
  margin-bottom: 40px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #1D1D1F;
  margin: 0;
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.5px;
`;

const Stats = styled.p`
  color: #86868B;
  font-size: 17px;
  margin: 8px 0 0 0;
  letter-spacing: -0.022em;
`;

const AquariumWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: #F0F9FF;
  border-radius: 24px;
  padding: 24px;
  min-height: 500px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: #86868B;
  font-size: 17px;
  letter-spacing: -0.022em;
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: #86868B;
  font-size: 17px;
  letter-spacing: -0.022em;
  text-align: center;
`;

const FishDetails = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 24px;
  border-radius: 16px;
  max-width: 400px;
  width: 90%;
  z-index: 1000;
  
  h3 {
    color: #1D1D1F;
    margin: 0 0 16px 0;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: -0.5px;
  }
  
  p {
    color: #86868B;
    font-size: 15px;
    line-height: 1.5;
    margin: 0 0 12px 0;
    letter-spacing: -0.022em;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  color: #86868B;
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: #1D1D1F;
  }
`;

const FishTank = () => {
  const [collectedFish, setCollectedFish] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFish, setSelectedFish] = useState(null);

  useEffect(() => {
    console.log('Connecting to Firebase...');
    const q = query(collection(db, 'scannedFish'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('Received Firestore update:', snapshot.size, 'documents');
      const fishData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));
      setCollectedFish(fishData);
      setLoading(false);
    }, (error) => {
      console.error('Firestore error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleFishClick = (fish) => {
    setSelectedFish(fish);
  };

  const closeDetails = () => {
    setSelectedFish(null);
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>My Fish Tank</Title>
          <Stats>Loading...</Stats>
        </Header>
        <LoadingContainer>Loading your fish collection...</LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>My Fish Tank</Title>
        <Stats>{collectedFish.length} fish collected</Stats>
      </Header>
      
      <AquariumWrapper>
        {collectedFish.length > 0 ? (
          <Aquarium collectedFish={collectedFish} onFishClick={handleFishClick} />
        ) : (
          <EmptyContainer>
            <p>No fish collected yet!</p>
            <p>Scan QR codes to add fish to your collection.</p>
          </EmptyContainer>
        )}
      </AquariumWrapper>

      {selectedFish && (
        <>
          <Overlay onClick={closeDetails} />
          <FishDetails>
            <CloseButton onClick={closeDetails}>&times;</CloseButton>
            <h3>{selectedFish.fishType}</h3>
            <p>{selectedFish.description}</p>
            <p>Captured: {selectedFish.timestamp?.toLocaleDateString()}</p>
          </FishDetails>
        </>
      )}
    </Container>
  );
};

export default FishTank; 