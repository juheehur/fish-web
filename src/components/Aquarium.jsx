import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import '../styles/Aquarium.css';

// Import images with correct paths
const goldfish = '/assets/fish/goldfish.png';
const tigerBarb = '/assets/fish/tiger-berb.png';

const Aquarium = ({ collectedFish }) => {
  const aquariumRef = useRef();
  const fishRefs = useRef([]);
  const [selectedFish, setSelectedFish] = useState(null);
  const [detailsPosition, setDetailsPosition] = useState({ x: 0, y: 0 });
  const [isClosing, setIsClosing] = useState(false);
  const [waterClarity, setWaterClarity] = useState(100); // 100 = crystal clear, 0 = very dirty

  // Add test fish for debugging
  const testFish = [
    {
      id: 'test-fish-1',
      type: 'tiger-barb',
      description: 'This is a Tiger Barb fish',
      timestamp: new Date()
    },
    {
      id: 'test-fish-2',
      type: 'goldfish',
      description: 'This is a Goldfish',
      timestamp: new Date()
    }
  ];

  // Use testFish for now
  const displayFish = testFish;

  useEffect(() => {
    console.log('Fish Images:', { goldfish, tigerBarb }); // Debug log
    console.log('Display Fish:', displayFish); // Debug log

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
    fishRefs.current.forEach((fish, index) => {
      if (!fish) {
        console.log('Fish ref not found for index:', index);
        return;
      }

      const aquariumHeight = aquariumRef.current?.clientHeight || 500;
      const aquariumWidth = aquariumRef.current?.clientWidth || 800;
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
        const shouldFlip = targetX < fish.getBoundingClientRect().left;
        
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
      aquariumRef.current?.appendChild(bubble);

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
        if (aquariumRef.current) {
          gsap.to(aquariumRef.current, {
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
  }, []);

  // Function to create and animate food particles
  const createFoodParticles = () => {
    const numParticles = 15; // Increased number of particles
    const foodPositions = [];
    
    const aquariumHeight = aquariumRef.current?.clientHeight || 500;
    const aquariumWidth = aquariumRef.current?.clientWidth || 800;
    const fishWidth = 80; // Width of the fish image
    const fishHeight = 50; // Approximate height of the fish image
    
    // Calculate safe swimming area with padding
    const padding = 20;
    const minX = padding;
    const maxX = aquariumWidth - fishWidth - padding;
    const minY = padding;
    const maxY = aquariumHeight - fishHeight - padding - 60; // Extra space for sand
    
    // First, create and animate all food particles
    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'food-particle';
      
      // More spread out food distribution
      const leftPosition = 10 + Math.random() * 80; // Use more of the width
      const horizontalVariation = Math.random() * 20 - 10; // Add some horizontal drift
      
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
      
      aquariumRef.current?.appendChild(particle);
      
      // Store food position for fish to target
      foodPositions.push({
        left: leftPosition,
        y: aquariumRef.current?.clientHeight - 100 - Math.random() * 50 // Vary final vertical position
      });

      // Animate food particle with some horizontal drift
      gsap.to(particle, {
        y: aquariumRef.current?.clientHeight - 100 - Math.random() * 50,
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
      fishRefs.current.forEach((fish, index) => {
        if (!fish) return;
        
        // Pick a random food particle to target
        const targetFood = foodPositions[Math.floor(Math.random() * foodPositions.length)];
        const fishRect = fish.getBoundingClientRect();
        const aquariumRect = aquariumRef.current.getBoundingClientRect();
        
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
    gsap.to(aquariumRef.current, {
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
      setIsClosing(false);
      const rect = event.target.getBoundingClientRect();
      setDetailsPosition({
        x: rect.left + rect.width / 2,
        y: rect.top
      });
      setSelectedFish(fish);
    }
  };

  const handleCloseDetails = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedFish(null);
      setIsClosing(false);
    }, 300); // Match the animation duration
  };

  const fishImages = {
    'goldfish': goldfish,
    'tiger-barb': tigerBarb
  };

  return (
    <div className="aquarium-container" ref={aquariumRef}>
      <div className="glass-reflection" />
      
      {/* Decorations */}
      <div className="seaweed" style={{ left: '10%', height: '120px' }} />
      <div className="seaweed" style={{ left: '30%', height: '90px' }} />
      <div className="seaweed" style={{ left: '70%', height: '100px' }} />
      <div className="seaweed" style={{ left: '85%', height: '80px' }} />
      
      <div className="coral" style={{ left: '20%' }} />
      <div className="coral" style={{ left: '50%', background: '#B794F4' }} />
      <div className="coral" style={{ left: '80%', background: '#F687B3' }} />

      {/* Fish */}
      {displayFish.map((fish, index) => (
        <img
          key={fish.id}
          ref={el => fishRefs.current[index] = el}
          className="fish"
          src={fishImages[fish.type] || fishImages['goldfish']}
          alt={`Fish ${index + 1}`}
          onClick={(e) => handleFishClick(fish, e)}
        />
      ))}

      {selectedFish && (
        <div 
          className="fish-details"
          style={{ 
            top: detailsPosition.y,
            left: detailsPosition.x,
            animation: isClosing ? 'popOut 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
          }}
        >
          <button className="close-button" onClick={handleCloseDetails} aria-label="Close details" />
          <h3>Fish Details</h3>
          <p>{selectedFish.description}</p>
          <p>Captured: {selectedFish.timestamp?.toLocaleDateString()}</p>
        </div>
      )}

      <div className="sand" />
    </div>
  );
};

export default Aquarium; 