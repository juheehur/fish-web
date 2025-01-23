import Fishcam from '../components/Fishcam';
import '../styles/Fishcam.css';

export default function FishcamPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>🐟 Fish Camera Analysis</h1>
        <p>Capture and analyze fish images with AI</p>
      </header>
      <Fishcam />
    </div>
  );
} 