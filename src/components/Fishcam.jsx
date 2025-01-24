import React, { useRef, useState, useEffect } from 'react';
import OpenAI from 'openai';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import '../styles/Fishcam.css';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const Fishcam = () => {
  const videoRef = useRef(null);
  const audioRef = useRef(new Audio());
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [response, setResponse] = useState('');
  const [facingMode, setFacingMode] = useState('user');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const audioQueue = useRef([]);
  const isPlaying = useRef(false);

  // Check for available cameras when component mounts
  useEffect(() => {
    const checkCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setHasMultipleCameras(videoDevices.length > 1);
      } catch (err) {
        console.error("Error checking cameras:", err);
        setHasMultipleCameras(false);
      }
    };
    checkCameras();
  }, []);

  // Initialize camera when component mounts or facingMode changes
  useEffect(() => {
    startCamera();
    // Cleanup function to stop the camera stream
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 15, max: 24 }
        } 
      });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const toggleCamera = () => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
  };

  // Process audio queue
  const processAudioQueue = async () => {
    if (isPlaying.current || audioQueue.current.length === 0) return;
    
    isPlaying.current = true;
    const audioUrl = audioQueue.current[0];
    
    try {
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        audioQueue.current.shift();
        isPlaying.current = false;
        processAudioQueue();
      };

      await audio.play();
    } catch (error) {
      console.error('Audio playback error:', error);
      isPlaying.current = false;
      processAudioQueue();
    }
  };

  const textToSpeech = async (text) => {
    if (!text.trim()) return;
    
    try {
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
      
      // Add to queue and process
      audioQueue.current.push(audioUrl);
      processAudioQueue();
    } catch (error) {
      console.error('TTS Error:', error);
    }
  };

  const saveFishData = async (fishData) => {
    try {
      const docRef = await addDoc(collection(db, 'scannedFish'), {
        ...fishData,
        timestamp: serverTimestamp(),
      });
      console.log('Fish data saved with ID:', docRef.id);
    } catch (error) {
      console.error('Error saving fish data:', error);
    }
  };

  const handleCapture = async () => {
    setIsLoading(true);
    // Clear any existing audio queue
    audioQueue.current = [];
    isPlaying.current = false;
    
    try {
      // 1. Capture image
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      const imageBase64 = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageBase64);
      
      // 2. Send to GPT Vision API with streaming response
      const stream = await openai.chat.completions.create({
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
        stream: true,
      });

      let fullResponse = '';
      let currentChunk = '';
      
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
        currentChunk += content;
        
        // Process complete sentences
        if (content.includes('.') || content.includes('!') || content.includes('?')) {
          if (currentChunk.trim()) {
            await textToSpeech(currentChunk.trim());
            currentChunk = '';
          }
        }
        
        setResponse(fullResponse);
      }

      // Process any remaining text
      if (currentChunk.trim()) {
        await textToSpeech(currentChunk.trim());
      }

      // Save to Firebase if fish is detected
      if (!fullResponse.toLowerCase().includes('fish is not detected')) {
        const fishData = {
          description: fullResponse,
          imageUrl: imageBase64,
        };
        await saveFishData(fishData);
      }

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
    <div className="fishcam-container">
      <div className="camera-section">
        <div className="camera-controls">
          <button 
            onClick={handleCapture}
            disabled={isLoading}
            className="capture-button"
          >
            <span className="button-icon">📸</span>
            {isLoading ? 'Analyzing...' : 'Capture & Analyze'}
          </button>

          {hasMultipleCameras && (
            <button 
              onClick={toggleCamera}
              className="toggle-camera-button"
            >
              <span className="button-icon">🔄</span>
              Switch Camera
            </button>
          )}

          {response && (
            <button 
              onClick={handlePlayTTS}
              className="play-tts-button"
            >
              <span className="button-icon">🔊</span>
              Play Again
            </button>
          )}
        </div>

        <div className="video-container">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
          />
          {capturedImage && (
            <div className="captured-image">
              <img src={capturedImage} alt="Captured" />
            </div>
          )}
        </div>
      </div>

      {response && (
        <div className="response-section">
          <h3>Analysis Result:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default Fishcam; 