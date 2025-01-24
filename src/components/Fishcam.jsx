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

  // Initialize camera when component mounts
  React.useEffect(() => {
    startCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
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
        model: "gpt-4-vision-preview",
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
          imageUrl: imageBase64,
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
    <div className="fishcam-container">
      <div className="camera-section">
        <button 
          onClick={handleCapture}
          disabled={isLoading}
          className="capture-button"
        >
          <span className="button-icon">📸</span>
          {isLoading ? 'Analyzing...' : 'Capture & Analyze'}
        </button>

        {response && (
          <button 
            onClick={handlePlayTTS}
            className="play-tts-button"
          >
            <span className="button-icon">🔊</span>
            Play Again
          </button>
        )}

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