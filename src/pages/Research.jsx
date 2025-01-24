import React, { useState, useEffect } from 'react';
import { getFishList } from '../services/fishApi';
import '../styles/Research.css';

const MISSION_IMAGES = [
  'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?auto=format&fit=crop&w=800&q=80', // Blue Tang fish
  'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80', // Coral reef
  'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=800&q=80', // Seagrass
  'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?auto=format&fit=crop&w=800&q=80', // Plankton study
  'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=800&q=80', // Sea turtle
  'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&w=800&q=80'  // Bioluminescent organisms
];

const Research = () => {
  const [researchMissions, setResearchMissions] = useState([
    {
      id: 1,
      title: "Exploration Mission to Locate the Black-scaled Ray",
      description: "The Oceanic Advanced Research Institute invites global ocean exploration enthusiasts and professional divers to join...",
      image: MISSION_IMAGES[0],
      score: 100,
      achievementCount: 56,
      myScore: 3860,
      withdrawable: 38.6,
      deadline: "February 18, 2025"
    },
    {
      id: 2,
      title: "Coral Bleaching Monitoring Mission",
      description: "Observe and document coral reefs in designated areas to track signs of bleaching. Record water temperature, pH levels...",
      image: MISSION_IMAGES[1],
      score: 50,
      achievementCount: 32,
      myScore: 1250,
      withdrawable: 12.5,
      deadline: "February 28, 2025"
    },
    {
      id: 3,
      title: "Seagrass Ecosystem Health Survey",
      description: "Assess seagrass coverage, density, and associated marine life. Provide photographs and measurements of coverage area...",
      image: MISSION_IMAGES[2],
      score: 80,
      achievementCount: 41,
      myScore: 2400,
      withdrawable: 24.0,
      deadline: "April 10, 2025"
    },
    {
      id: 4,
      title: "Plankton Diversity and Distribution Study",
      description: "Collect and analyze plankton samples from specified areas. Identify key species and record water conditions...",
      image: MISSION_IMAGES[3],
      score: 100,
      achievementCount: 28,
      myScore: 3100,
      withdrawable: 31.0,
      deadline: "April 20, 2025"
    },
    {
      id: 5,
      title: "Tracking Sea Turtle Migration Patterns",
      description: "Observe and record sightings of tagged sea turtles to contribute to ongoing research. Requirements: Use a tracking app...",
      image: MISSION_IMAGES[4],
      score: 120,
      achievementCount: 35,
      myScore: 4200,
      withdrawable: 42.0,
      deadline: "May 15, 2025"
    },
    {
      id: 6,
      title: "Survey of Bioluminescent Organisms",
      description: "Identify and photograph bioluminescent organisms in designated marine areas. Document depth, time, and conditions...",
      image: MISSION_IMAGES[5],
      score: 90,
      achievementCount: 44,
      myScore: 2800,
      withdrawable: 28.0,
      deadline: "May 25, 2025"
    }
  ]);

  const [selectedMission, setSelectedMission] = useState(null);
  const [completedMissions, setCompletedMissions] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [totalWithdrawable, setTotalWithdrawable] = useState(0);

  useEffect(() => {
    // Calculate total score and withdrawable amount
    const score = researchMissions.reduce((acc, mission) => acc + mission.myScore, 0);
    const withdrawable = researchMissions.reduce((acc, mission) => acc + mission.withdrawable, 0);
    setTotalScore(score);
    setTotalWithdrawable(withdrawable);
  }, [researchMissions]);

  const handleMissionSelect = (mission) => {
    setSelectedMission(mission);
  };

  const handleMissionComplete = (missionId) => {
    // Mark mission as completed
    setCompletedMissions([...completedMissions, missionId]);
    
    // Update mission status
    const updatedMissions = researchMissions.map(mission => {
      if (mission.id === missionId) {
        return {
          ...mission,
          achievementCount: mission.achievementCount + 1,
          myScore: mission.myScore + mission.score,
          withdrawable: mission.withdrawable + (mission.score / 100)
        };
      }
      return mission;
    });
    
    setResearchMissions(updatedMissions);
  };

  const handleWithdraw = (missionId) => {
    // Process withdrawal for specific mission
    const updatedMissions = researchMissions.map(mission => {
      if (mission.id === missionId) {
        return {
          ...mission,
          withdrawable: 0
        };
      }
      return mission;
    });
    
    setResearchMissions(updatedMissions);
  };

  const handleWithdrawAll = () => {
    // Process withdrawal for all missions
    const updatedMissions = researchMissions.map(mission => ({
      ...mission,
      withdrawable: 0
    }));
    
    setResearchMissions(updatedMissions);
  };

  return (
    <div className="research-container">
      <div className="research-header">
        <h1>Research Mission</h1>
        <div className="research-stats">
          <div>Achievement Count: {completedMissions.length}</div>
          <div>My Score: {totalScore}</div>
          <div>Withdrawable: ${totalWithdrawable.toFixed(1)}</div>
        </div>
      </div>

      <div className="missions-list">
        {researchMissions.map(mission => (
          <div key={mission.id} className="mission-card" onClick={() => handleMissionSelect(mission)}>
            <img src={mission.image} alt={mission.title} />
            <div className="mission-content">
              <h3>{mission.title}</h3>
              <p>{mission.description}</p>
              <div className="mission-stats">
                <span>Score: {mission.score}</span>
                <span>DDL: {mission.deadline}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMission && (
        <div className="mission-details">
          <h2>{selectedMission.title}</h2>
          <p>{selectedMission.description}</p>
          <div className="mission-actions">
            <button onClick={() => handleMissionComplete(selectedMission.id)}>
              Complete Mission
            </button>
            {selectedMission.withdrawable > 0 && (
              <button onClick={() => handleWithdraw(selectedMission.id)}>
                Withdraw ${selectedMission.withdrawable.toFixed(1)}
              </button>
            )}
          </div>
        </div>
      )}

      {totalWithdrawable > 0 && (
        <button className="withdraw-all" onClick={handleWithdrawAll}>
          Withdraw All ${totalWithdrawable.toFixed(1)}
        </button>
      )}
    </div>
  );
};

export default Research; 