import React, { useRef, useState, useEffect } from 'react';
import OpenAI from 'openai';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import styled from 'styled-components';
import { MdCameraswitch, MdCamera } from 'react-icons/md';
import '../styles/Fishcam.css';

const CameraContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CameraControls = styled.div`
  position: absolute;
  bottom: 100px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px;
  z-index: 10;
`;

const CameraButton = styled.button`
  width: ${props => props.$capture ? '70px' : '50px'};
  height: ${props => props.$capture ? '70px' : '50px'};
  border-radius: 50%;
  border: none;
  background: ${props => props.$capture ? '#2B6CB0' : 'rgba(255, 255, 255, 0.3)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
    background: ${props => props.$capture ? '#2C5282' : 'rgba(255, 255, 255, 0.4)'};
  }

  svg {
    width: ${props => props.$capture ? '30px' : '24px'};
    height: ${props => props.$capture ? '30px' : '24px'};
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
`;

const ResultPopup = styled.div`
  position: absolute;
  bottom: 180px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  box-sizing: border-box;
  animation: slideUp 0.3s ease-out;
  z-index: 20;

  @keyframes slideUp {
    from {
      transform: translate(-50%, 100%);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }
`;

const ResultText = styled.p`
  margin: 10px 0;
  font-size: 16px;
  line-height: 1.5;
  color: #2D3748;
`;

const PlayButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #2B6CB0;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  margin-top: 12px;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;

  &:hover {
    background: #2C5282;
    transform: scale(1.02);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #4A5568;
  cursor: pointer;
  padding: 4px;
  font-size: 20px;
  
  &:hover {
    color: #2D3748;
  }
`;

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const Fishcam = () => {
  const videoRef = useRef(null);
  const audioRef = useRef(new Audio());
  const [isLoading, setIsLoading] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const [response, setResponse] = useState('');
  const [facingMode, setFacingMode] = useState('environment');

  const startCamera = async () => {
    try {
      setIsLoading(true);
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const handleSwitchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const textToSpeech = async (text) => {
    try {
      console.log('Using API Key:', process.env.REACT_APP_ELEVENLABS_API_KEY);
      
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.REACT_APP_ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.5,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`TTS API request failed: ${JSON.stringify(errorData)}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      audioRef.current.src = audioUrl;
      await audioRef.current.play();
    } catch (error) {
      console.error('TTS Error:', error);
    }
  };

  const getFishType = (description) => {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('tiger barb') || lowerDesc.includes('tigerbarb')) {
      return 'tiger-berb';
    }
    // Add more fish type mappings here
    return 'goldfish'; // default fish type
  };

  const saveFishData = async (fishData) => {
    try {
      const fishType = getFishType(fishData.description);
      const docRef = await addDoc(collection(db, 'scannedFish'), {
        description: fishData.description,
        fishType: fishType,
        timestamp: serverTimestamp(),
      });
      console.log('Fish data saved with ID:', docRef.id);
    } catch (error) {
      console.error('Error saving fish data:', error);
    }
  };

  const handleCapture = async () => {
    setIsLoading(true);
    try {
      // 1. Capture image
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      const imageBase64 = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageBase64);
      
      // 2. Send to GPT Vision API
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Write everything in short paragraph and never add markdown. Find any sea animal in the image. Describe the animal in the image in friendly tone to the child, just guess the species. if there are no marine animal, say 'fish is not detected'. if fish is detected, just guess it and pretend that u know well about it. if there is any endangered or rare animal, emphasize it. Describe the species to children and include 'fun facts'." },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ],
          },
        ],
        max_tokens: 500,
      });

      const message = response.choices[0].message.content;
      setResponse(message);
      
      // Save to Firebase if fish is detected
      if (!message.toLowerCase().includes('fish is not detected')) {
        const fishData = {
          description: message,
        };
        await saveFishData(fishData);
      }
      
      // 3. Use ElevenLabs TTS
      await textToSpeech(message);

    } catch (error) {
      console.error('Error:', error);
      setResponse('Error processing image');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayTTS = () => {
    if (response) {
      textToSpeech(response);
    }
  };

  // Clean up audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current.src) {
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, []);

  return (
    <CameraContainer>
      <Video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        onLoadedMetadata={() => setIsLoading(false)}
      />
      <CameraControls>
        <CameraButton onClick={handleSwitchCamera}>
          <MdCameraswitch />
        </CameraButton>
        <CameraButton $capture onClick={handleCapture}>
          <MdCamera />
        </CameraButton>
      </CameraControls>
      {isLoading && (
        <LoadingOverlay>
          Loading Camera...
        </LoadingOverlay>
      )}

      {response && (
        <ResultPopup>
          <CloseButton onClick={() => setResponse('')}>×</CloseButton>
          <ResultText>{response}</ResultText>
          <PlayButton onClick={handlePlayTTS}>
            <span>🔊</span> Play Again
          </PlayButton>
        </ResultPopup>
      )}
    </CameraContainer>
  );
};

export default Fishcam; 