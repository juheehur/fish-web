import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Aquarium } from './Aquarium';

const Container = styled.div`
  padding: 20px;
  padding-bottom: 80px;
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #2D3748;
  margin: 0;
`;

const Stats = styled.p`
  color: #718096;
  margin: 8px 0 0 0;
`;

const AquariumWrapper = styled.div`
  background: #F0F9FF;
  border-radius: 16px;
  padding: 20px;
  min-height: 500px;
  margin: 0 -20px;
  position: relative;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  color: #718096;
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  color: #718096;
  text-align: center;
  gap: 12px;

  p {
    margin: 0;
    font-size: 16px;
  }
`;

const FishTank = () => {
  const [collectedFish, setCollectedFish] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      console.log('Connecting to Firebase...');
      const q = query(collection(db, 'scannedFish'), orderBy('timestamp', 'desc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log('Received Firestore update:', snapshot.size, 'documents');
        const fishData = snapshot.docs.map(doc => {
          console.log('Fish data:', doc.data());
          return {
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate()
          };
        });
        setCollectedFish(fishData);
        setLoading(false);
      }, (error) => {
        console.error('Firestore error:', error);
        setError(error.message);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Setup error:', error);
      setError(error.message);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Loading your fish collection...</LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <EmptyContainer>
          <p>Error loading fish collection</p>
          <p>{error}</p>
        </EmptyContainer>
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
        {collectedFish.length === 0 ? (
          <EmptyContainer>
            <p>No fish collected yet!</p>
            <p>Use the camera to scan and collect fish</p>
          </EmptyContainer>
        ) : (
          <Aquarium collectedFish={collectedFish} />
        )}
      </AquariumWrapper>
    </Container>
  );
};

export default FishTank; 