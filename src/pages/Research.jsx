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

const MISSION_TASKS = {
  1: [
    "Document sightings of Black-scaled Ray in designated areas",
    "Collect water samples from ray habitats",
    "Photograph ray behavior patterns",
    "Record depth and temperature data",
    "Submit comprehensive report with findings"
  ],
  2: [
    "Monitor coral color changes in 3 different locations",
    "Measure and record water temperature daily",
    "Test pH levels in affected areas",
    "Photograph coral conditions with timestamp",
    "Submit environmental data report"
  ],
  3: [
    "Map seagrass bed locations",
    "Measure seagrass density in sample areas",
    "Document marine life in seagrass zones",
    "Collect growth rate data",
    "Submit ecosystem analysis report"
  ],
  4: [
    "Collect plankton samples from surface waters",
    "Analyze species diversity in samples",
    "Record water conditions and time of collection",
    "Document plankton distribution patterns",
    "Submit species identification report"
  ],
  5: [
    "Track and record sea turtle sightings",
    "Document feeding behavior patterns",
    "Map migration routes using GPS data",
    "Photograph turtle identification marks",
    "Submit tracking data and observations"
  ],
  6: [
    "Identify bioluminescent species present",
    "Record depth of organism sightings",
    "Document time patterns of luminescence",
    "Measure light intensity levels",
    "Submit species catalog with photos"
  ]
};

const Research = () => {
  const [researchMissions, setResearchMissions] = useState([
    {
      id: 1,
      title: "Exploration Mission to Locate the Black-scaled Ray",
      description: "The Oceanic Advanced Research Institute invites global ocean exploration enthusiasts and professional divers to join...",
      image: MISSION_IMAGES[0],
      score: 5,          // Base score per task completion
      achievementCount: 0,
      myScore: 0,        // Accumulated score
      withdrawable: 0,    // $1 per 5 points
      deadline: "February 18, 2025"
    },
    {
      id: 2,
      title: "Coral Bleaching Monitoring Mission",
      description: "Observe and document coral reefs in designated areas to track signs of bleaching. Record water temperature, pH levels...",
      image: MISSION_IMAGES[1],
      score: 4,
      achievementCount: 0,
      myScore: 0,
      withdrawable: 0,
      deadline: "February 28, 2025"
    },
    {
      id: 3,
      title: "Seagrass Ecosystem Health Survey",
      description: "Assess seagrass coverage, density, and associated marine life. Provide photographs and measurements of coverage area...",
      image: MISSION_IMAGES[2],
      score: 3,
      achievementCount: 0,
      myScore: 0,
      withdrawable: 0,
      deadline: "April 10, 2025"
    },
    {
      id: 4,
      title: "Plankton Diversity and Distribution Study",
      description: "Collect and analyze plankton samples from specified areas. Identify key species and record water conditions...",
      image: MISSION_IMAGES[3],
      score: 4,
      achievementCount: 0,
      myScore: 0,
      withdrawable: 0,
      deadline: "April 20, 2025"
    },
    {
      id: 5,
      title: "Tracking Sea Turtle Migration Patterns",
      description: "Observe and record sightings of tagged sea turtles to contribute to ongoing research. Requirements: Use a tracking app...",
      image: MISSION_IMAGES[4],
      score: 6,
      achievementCount: 0,
      myScore: 0,
      withdrawable: 0,
      deadline: "May 15, 2025"
    },
    {
      id: 6,
      title: "Survey of Bioluminescent Organisms",
      description: "Identify and photograph bioluminescent organisms in designated marine areas. Document depth, time, and conditions...",
      image: MISSION_IMAGES[5],
      score: 5,
      achievementCount: 0,
      myScore: 0,
      withdrawable: 0,
      deadline: "May 25, 2025"
    }
  ]);

  const [selectedMission, setSelectedMission] = useState(null);
  const [completedMissions, setCompletedMissions] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [totalWithdrawable, setTotalWithdrawable] = useState(0);
  const [missionProgress, setMissionProgress] = useState({});
  const [showMissionDetails, setShowMissionDetails] = useState(false);

  useEffect(() => {
    // Calculate total score and withdrawable amount
    const score = researchMissions.reduce((acc, mission) => acc + mission.myScore, 0);
    const withdrawable = researchMissions.reduce((acc, mission) => acc + mission.withdrawable, 0);
    setTotalScore(score);
    setTotalWithdrawable(withdrawable);
  }, [researchMissions]);

  const handleMissionSelect = (mission) => {
    setSelectedMission(mission);
    setShowMissionDetails(true);
    // Initialize progress if not exists
    if (!missionProgress[mission.id]) {
      setMissionProgress(prev => ({
        ...prev,
        [mission.id]: {
          tasksCompleted: 0,
          totalTasks: 5,
          completedTasks: [],
          lastActivity: null,
          notes: '',
          photos: []
        }
      }));
    }
  };

  const closeMissionDetails = () => {
    setShowMissionDetails(false);
    setSelectedMission(null);
  };

  const handleAddNote = (missionId, note) => {
    setMissionProgress(prev => ({
      ...prev,
      [missionId]: {
        ...prev[missionId],
        notes: note,
        lastActivity: new Date().toISOString()
      }
    }));
  };

  const handleTaskComplete = (missionId, taskIndex) => {
    setMissionProgress(prev => {
      const currentProgress = prev[missionId] || {
        tasksCompleted: 0,
        totalTasks: 5,
        completedTasks: [],
        lastActivity: null,
        notes: '',
        photos: []
      };

      // Check if task is already completed
      if (currentProgress.completedTasks.includes(taskIndex)) {
        return prev;
      }

      const updatedProgress = {
        ...currentProgress,
        tasksCompleted: currentProgress.tasksCompleted + 1,
        completedTasks: [...currentProgress.completedTasks, taskIndex],
        lastActivity: new Date().toISOString()
      };

      // Check if all tasks are completed
      if (updatedProgress.tasksCompleted >= updatedProgress.totalTasks) {
        handleMissionComplete(missionId);
      }

      return {
        ...prev,
        [missionId]: updatedProgress
      };
    });
  };

  const handleMissionComplete = (missionId) => {
    // Mark mission as completed
    setCompletedMissions([...completedMissions, missionId]);
    
    // Update mission status with realistic rewards
    const updatedMissions = researchMissions.map(mission => {
      if (mission.id === missionId) {
        const newScore = mission.myScore + mission.score;
        return {
          ...mission,
          achievementCount: mission.achievementCount + 1,
          myScore: newScore,
          withdrawable: Math.floor(newScore / 5)  // $1 for every 5 points
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
                {missionProgress[mission.id] && (
                  <span className="progress-indicator">
                    {missionProgress[mission.id].tasksCompleted}/{missionProgress[mission.id].totalTasks}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showMissionDetails && selectedMission && (
        <div className="mission-details">
          <button className="close-button" onClick={closeMissionDetails}>×</button>
          
          <div className="mission-details-content">
            <img src={selectedMission.image} alt={selectedMission.title} className="detail-image"/>
            
            <h2>{selectedMission.title}</h2>
            <div className="mission-metadata">
              <span>Score: {selectedMission.score}</span>
              <span>Deadline: {selectedMission.deadline}</span>
              <span>Achievements: {selectedMission.achievementCount}</span>
            </div>
            
            <p className="detailed-description">{selectedMission.description}</p>
            
            <div className="progress-section">
              <h3>Mission Tasks</h3>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{
                    width: `${(missionProgress[selectedMission.id]?.tasksCompleted / missionProgress[selectedMission.id]?.totalTasks) * 100}%`
                  }}
                ></div>
              </div>
              <p>{missionProgress[selectedMission.id]?.tasksCompleted || 0}/{missionProgress[selectedMission.id]?.totalTasks} tasks completed</p>
              
              <div className="task-list">
                {MISSION_TASKS[selectedMission.id].map((task, index) => (
                  <div 
                    key={index} 
                    className={`task-item ${missionProgress[selectedMission.id]?.completedTasks.includes(index) ? 'completed' : ''}`}
                    onClick={() => handleTaskComplete(selectedMission.id, index)}
                  >
                    <div className="task-checkbox">
                      {missionProgress[selectedMission.id]?.completedTasks.includes(index) && (
                        <span className="checkmark">✓</span>
                      )}
                    </div>
                    <span className="task-text">{task}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="notes-section">
              <h3>Research Notes</h3>
              <textarea
                value={missionProgress[selectedMission.id]?.notes || ''}
                onChange={(e) => handleAddNote(selectedMission.id, e.target.value)}
                placeholder="Add your research notes here..."
                className="research-notes"
              />
            </div>

            {selectedMission.withdrawable > 0 && (
              <button 
                className="withdraw-button"
                onClick={() => handleWithdraw(selectedMission.id)}
              >
                Withdraw ${selectedMission.withdrawable.toFixed(1)}
              </button>
            )}

            {missionProgress[selectedMission.id]?.lastActivity && (
              <p className="last-activity">
                Last activity: {new Date(missionProgress[selectedMission.id].lastActivity).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      )}

      {totalWithdrawable > 0 && !showMissionDetails && (
        <button className="withdraw-all" onClick={handleWithdrawAll}>
          Withdraw All ${totalWithdrawable.toFixed(1)}
        </button>
      )}
    </div>
  );
};

export default Research; 