import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import '../styles/Aquarium.css';
import tigerBerbImage from '../assets/fish/tiger-berb.png';
import goldfishImage from '../assets/fish/goldfish.png';

const AquariumContainer = styled.div`
  width: 100%;
  height: 500px;
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: linear-gradient(180deg, #BEE3F8 0%, #90CDF4 100%);
`;

const FishImage = styled.img`
  position: absolute;
  width: 50px;
  height: auto;
  transform: ${props => props.$isMovingLeft ? 'scaleX(-1)' : 'scaleX(1)'};
  transition: transform 0.5s;
  cursor: pointer;
`;

const Sand = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #F6E05E;
  border-radius: 0 0 16px 16px;
`;

const Seaweed = styled.div`
  position: absolute;
  bottom: 0;
  width: 20px;
  height: ${props => props.$height || '80px'};
  background: #48BB78;
  border-radius: 8px;
  transform-origin: bottom;
  animation: sway 3s ease-in-out infinite;
  opacity: 0.8;

  @keyframes sway {
    0%, 100% { transform: rotate(-5deg); }
    50% { transform: rotate(5deg); }
  }
`;

const FishDetails = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.4;
  max-width: 250px;
  z-index: 10;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  transform: translate(-50%, -100%);
  margin-top: -10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const Aquarium = ({ collectedFish }) => {
  const [fishPositions, setFishPositions] = useState([]);
  const [selectedFish, setSelectedFish] = useState(null);
  const containerRef = useRef(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [waterClarity, setWaterClarity] = useState(100); // 100 = crystal clear, 0 = very dirty

  useEffect(() => {
    if (containerRef.current) {
      setContainerDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);

  useEffect(() => {
    if (containerDimensions.width === 0) return;

    console.log('Setting up fish positions for:', collectedFish);
    const initialPositions = collectedFish.map((fish) => ({
      ...fish,
      x: Math.random() * (containerDimensions.width - 100),
      y: 60 + Math.random() * (containerDimensions.height - 180),
      isMovingLeft: Math.random() > 0.5,
      speed: 0.5 + Math.random() * 0.5,
    }));

    console.log('Initial positions:', initialPositions);
    setFishPositions(initialPositions);

    const interval = setInterval(() => {
      setFishPositions(prevPositions => {
        return prevPositions.map(fish => {
          let newX = fish.x + (fish.isMovingLeft ? -1 : 1) * fish.speed;
          let newIsMovingLeft = fish.isMovingLeft;

          if (newX <= 0) {
            newX = 0;
            newIsMovingLeft = false;
          } else if (newX >= containerDimensions.width - 50) {
            newX = containerDimensions.width - 50;
            newIsMovingLeft = true;
          }

          return {
            ...fish,
            x: newX,
            isMovingLeft: newIsMovingLeft,
          };
        });
      });
    }, 16);

    return () => clearInterval(interval);
  }, [collectedFish, containerDimensions.width, containerDimensions.height]);

  useEffect(() => {
    console.log('Display Fish:', collectedFish);

    // Animate seaweed
    const seaweeds = document.querySelectorAll('.seaweed');
    seaweeds.forEach((seaweed) => {
      gsap.to(seaweed, {
        rotation: '10',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    });

    // Animate fish
    fishPositions.forEach((fish, index) => {
      if (!fish) {
        console.log('Fish ref not found for index:', index);
        return;
      }

      const aquariumHeight = containerRef.current?.clientHeight || 500;
      const aquariumWidth = containerRef.current?.clientWidth || 800;
      const fishWidth = 80;
      const fishHeight = 50;
      
      const padding = 20;
      const minX = padding;
      const maxX = aquariumWidth - fishWidth - padding;
      const minY = padding;
      const maxY = aquariumHeight - fishHeight - padding - 60;
      
      const startX = minX + Math.random() * (maxX - minX);
      const startY = minY + Math.random() * (maxY - minY);
      
      // Set initial position and scale
      gsap.set(fish, { 
        x: startX,
        y: startY,
        scale: 0.8 + Math.random() * 0.4,
        opacity: 1,
        scaleY: 1 // Ensure vertical scale is always 1
      });
      
      // Create swimming pattern
      const createSwimmingPattern = () => {
        const duration = 5 + Math.random() * 5;
        const targetX = minX + Math.random() * (maxX - minX);
        const targetY = minY + Math.random() * (maxY - minY);
        
        // Only flip horizontally based on movement direction
        const shouldFlip = targetX < fish.x;
        
        gsap.to(fish, {
          x: targetX,
          y: targetY,
          duration: duration,
          ease: "power1.inOut",
          onStart: () => {
            // Only change scaleX for direction, keep scaleY constant
            gsap.set(fish, { 
              scaleX: shouldFlip ? -1 : 1,
              scaleY: 1
            });
          },
          onComplete: createSwimmingPattern
        });
      };
      
      createSwimmingPattern();
      
      // Gentler vertical movement
      gsap.to(fish, {
        y: `+=${10}`,
        duration: 2 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    });

    // Create and animate bubbles
    const createBubble = () => {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      const size = 5 + Math.random() * 10;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.bottom = '0';
      containerRef.current?.appendChild(bubble);

      gsap.to(bubble, {
        y: -window.innerHeight,
        duration: 5 + Math.random() * 5,
        ease: 'power1.out',
        onComplete: () => {
          bubble.remove();
        }
      });
    };

    const bubbleInterval = setInterval(createBubble, 2000);

    // Gradually make water dirty (every 7 seconds)
    const dirtyInterval = setInterval(() => {
      setWaterClarity(prev => {
        const newClarity = Math.max(0, prev - 5); // Decrease by 5% each time
        
        // Update visual effect
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            filter: `brightness(${0.7 + (newClarity / 100) * 0.3})`,
            duration: 0.5
          });
        }
        
        return newClarity;
      });
    }, 7000); // 7 seconds interval

    return () => {
      clearInterval(bubbleInterval);
      clearInterval(dirtyInterval);
    };
  }, [collectedFish, containerDimensions.width, containerDimensions.height]);

  // Function to create and animate food particles
  const createFoodParticles = () => {
    const numParticles = 15;
    const foodPositions = [];
    
    const aquariumHeight = containerRef.current?.clientHeight || 500;
    const aquariumWidth = containerRef.current?.clientWidth || 800;
    const fishWidth = 80;
    const fishHeight = 50;
    
    // Calculate safe swimming area with padding
    const padding = 20;
    const minX = padding;
    const maxX = aquariumWidth - fishWidth - padding;
    const minY = padding;
    const maxY = aquariumHeight - fishHeight - padding - 60;
    
    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'food-particle';
      
      const leftPosition = 10 + Math.random() * 80;
      const horizontalVariation = Math.random() * 20 - 10;
      
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: #F6AD55;
        border-radius: 50%;
        opacity: 0;
        top: 0;
        left: ${leftPosition}%;
      `;
      
      containerRef.current?.appendChild(particle);
      
      // Store food position for fish to target
      foodPositions.push({
        left: leftPosition,
        y: containerRef.current?.clientHeight - 100 - Math.random() * 50
      });

      gsap.to(particle, {
        y: containerRef.current?.clientHeight - 100 - Math.random() * 50,
        x: horizontalVariation,
        opacity: 1,
        duration: 2 + Math.random() * 2,
        ease: "power1.in",
        onComplete: () => {
          particle.remove();
        }
      });
    }

    // After a small delay, make fish swim towards food
    setTimeout(() => {
      fishPositions.forEach((fish, index) => {
        if (!fish) return;
        
        // Pick a random food particle to target
        const targetFood = foodPositions[Math.floor(Math.random() * foodPositions.length)];
        const fishRect = fish.getBoundingClientRect();
        const aquariumRect = containerRef.current.getBoundingClientRect();
        
        // Calculate relative position within aquarium
        const targetX = (targetFood.left / 100) * aquariumRect.width;
        
        // Create a natural swimming motion
        gsap.to(fish, {
          x: Math.max(minX, Math.min(maxX, targetX - fishWidth / 2)),
          y: Math.max(minY, Math.min(maxY, targetFood.y - Math.random() * 40)),
          duration: 1 + Math.random(),
          ease: "power2.inOut",
          onStart: () => {
            // Flip fish based on movement direction
            gsap.set(fish, { scaleX: targetX < fishRect.left ? -1 : 1 });
          },
          onComplete: () => {
            // Create a new swimming pattern after reaching food
            const duration = 5 + Math.random() * 5;
            const newTargetX = minX + Math.random() * (maxX - minX);
            const newTargetY = minY + Math.random() * (maxY - minY);
            
            gsap.to(fish, {
              x: newTargetX,
              y: newTargetY,
              duration: duration,
              ease: "power1.inOut",
              onStart: () => {
                gsap.set(fish, { scaleX: newTargetX < fish.getBoundingClientRect().left ? -1 : 1 });
              }
            });
          }
        });
      });
    }, 800); // Slightly faster reaction time
  };

  // Function to clean the aquarium
  const cleanAquarium = () => {
    setWaterClarity(100);
    gsap.to(containerRef.current, {
      filter: 'brightness(1)',
      duration: 1
    });
  };

  // Listen for feed and clean events
  useEffect(() => {
    const handleCustomEvent = (e) => {
      if (e.detail.type === 'feed') {
        createFoodParticles();
      } else if (e.detail.type === 'clean') {
        cleanAquarium();
      }
    };

    window.addEventListener('aquarium-action', handleCustomEvent);
    return () => window.removeEventListener('aquarium-action', handleCustomEvent);
  }, []);

  const handleFishClick = (fish, event) => {
    if (selectedFish?.id === fish.id) {
      handleCloseDetails();
    } else {
      setSelectedFish(fish);
    }
  };

  const handleCloseDetails = () => {
    setSelectedFish(null);
  };

  const getFishImage = (fishType) => {
    console.log('Getting image for fish type:', fishType);
    const fishImages = {
      'tiger-berb': tigerBerbImage,
      'goldfish': goldfishImage
    };
    const imagePath = fishImages[fishType] || fishImages.goldfish;
    console.log('Selected image path:', imagePath);
    return imagePath;
  };

  return (
    <AquariumContainer ref={containerRef}>
      <div className="glass-reflection" />
      
      {/* Decorations */}
      <Sand />
      <Seaweed style={{ left: '10%' }} $height="80px" />
      <Seaweed style={{ left: '25%' }} $height="100px" />
      <Seaweed style={{ left: '40%' }} $height="70px" />
      <Seaweed style={{ left: '60%' }} $height="90px" />
      
      {fishPositions.map((fish, index) => {
        console.log('Rendering fish:', fish);
        return (
          <FishImage
            key={`${fish.id}-${index}`}
            src={getFishImage(fish.fishType)}
            alt={`Fish ${fish.id}`}
            style={{
              left: `${fish.x}px`,
              top: `${fish.y}px`,
              opacity: 1,
              visibility: 'visible'
            }}
            $isMovingLeft={fish.isMovingLeft}
            onClick={(e) => handleFishClick(fish, e)}
            onError={(e) => console.error('Error loading fish image:', e)}
            onLoad={() => console.log('Fish image loaded successfully')}
          />
        );
      })}

      {selectedFish && (
        <FishDetails
          $top={selectedFish.clickY}
          $left={selectedFish.clickX}
          onClick={handleCloseDetails}
        >
          <h3>Fish Details</h3>
          <p>{selectedFish.description}</p>
          <p>Captured: {selectedFish.timestamp?.toLocaleDateString()}</p>
        </FishDetails>
      )}
    </AquariumContainer>
  );
};

export default Aquarium; 