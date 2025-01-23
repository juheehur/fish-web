import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FishcamPage from './pages/fishcam';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/fishcam" element={<FishcamPage />} />
        <Route path="/" element={<FishcamPage />} /> {/* Optional: redirect home to fishcam */}
      </Routes>
    </Router>
  );
}

export default App;
