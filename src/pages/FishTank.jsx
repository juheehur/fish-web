import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import styled from 'styled-components';
import Aquarium from '../components/Aquarium';

const Container = styled.div`
  min-height: 100vh;
  background: #F7FAFC;
  padding: 20px;
  padding-bottom: 80px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: #2B6CB0;
  margin: 0;
  font-size: 24px;
`;

const Stats = styled.div`
  color: #4A5568;
  font-size: 14px;
  margin-top: 8px;
`;

const AquariumWrapper = styled.div`
  height: 80vh;
  background: #F0F9FF;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const Controls = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 100;
  width: 90%;
  max-width: 300px;
  justify-content: center;
`;

const Button = styled.button`
  background: ${props => props.variant === 'feed' ? '#4CAF50' : '#3182CE'};
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 30px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  flex: 1;
  justify-content: center;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 8px 12px;
  }
`;

const StatusMessage = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  z-index: 100;
  visibility: ${props => props.$isVisible ? 'visible' : 'hidden'};
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.3s, visibility 0.3s;
`;

const LoadingContainer = styled.div`
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #F0F9FF;
  border-radius: 20px;
  color: #4A5568;
  font-size: 18px;
`;

const EmptyContainer = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #F0F9FF;
  border-radius: 20px;
  color: #4A5568;
  text-align: center;
  
  h3 {
    margin: 0 0 12px 0;
    font-size: 20px;
    color: #2B6CB0;
  }
  
  p {
    margin: 0;
    font-size: 16px;
  }
`;

const FishTank = () => {
  const [collectedFish, setCollectedFish] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFed, setLastFed] = useState(null);
  const [lastCleaned, setLastCleaned] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const loadCollectedFish = async () => {
      try {
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

  const showStatusMessage = (message) => {
    setStatusMessage(message);
    setShowStatus(true);
    setTimeout(() => setShowStatus(false), 3000);
  };

  const handleFeed = () => {
    setLastFed(new Date());
    showStatusMessage('Fish have been fed! 🐟');
    window.dispatchEvent(new CustomEvent('aquarium-action', { 
      detail: { type: 'feed' } 
    }));
  };

  const handleClean = () => {
    setLastCleaned(new Date());
    showStatusMessage('Aquarium cleaned! ✨');
    window.dispatchEvent(new CustomEvent('aquarium-action', { 
      detail: { type: 'clean' } 
    }));
  };

  const canClean = !lastCleaned || (new Date() - lastCleaned) > 60000; // 60 seconds cooldown

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>My Fish Tank</Title>
        </Header>
        <LoadingContainer>
          Loading your aquarium...
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>My Fish Tank</Title>
        <Stats>Test Fish Swimming</Stats>
      </Header>
      <AquariumWrapper>
        <StatusMessage $isVisible={showStatus}>
          {statusMessage}
        </StatusMessage>
        <Aquarium collectedFish={[]} />
        <Controls>
          <Button 
            variant="feed" 
            onClick={handleFeed}
            title="Feed the fish"
          >
            🍽️ Feed Fish
          </Button>
          <Button 
            variant="clean" 
            onClick={handleClean} 
            disabled={!canClean}
            title={!canClean ? "Wait a bit before cleaning again" : "Clean the aquarium"}
          >
            🧹 Clean Tank
          </Button>
        </Controls>
      </AquariumWrapper>
    </Container>
  );
};

export default FishTank; 