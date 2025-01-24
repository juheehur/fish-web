import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Map from './pages/Map';
import FishTank from './pages/FishTank';
import Research from './pages/Research';
import News from './pages/News';
import Fishcam from './components/Fishcam';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <div className="content">
          <Routes>
            <Route path="/" element={<Fishcam />} />
            <Route path="/map" element={<Map />} />
            <Route path="/fishtank" element={<FishTank />} />
            <Route path="/research" element={<Research />} />
            <Route path="/news" element={<News />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Navigation />
      </div>
    </Router>
  );
}

export default App;
