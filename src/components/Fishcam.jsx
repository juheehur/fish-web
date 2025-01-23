import React, { useRef, useState } from 'react';
import OpenAI from 'openai';
import '../styles/Fishcam.css';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Note: Changed to REACT_APP_ prefix
  dangerouslyAllowBrowser: true // Required for client-side usage
});

const Fishcam = () => {
  const videoRef = useRef(null);
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
      
      // 2. Send to GPT Vision API directly
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: "Write everything in short paragraph and never add markdown. Find any sea animal in the image. Describe the animal in the image in friendly tone to the child, just guess the species. if there are no marine animal, say 'fish is not detected'. if fish is detected, just guess it and pretend that u know well about it. if there is any endangered or rare animal, emphasize it. Describe the species to children and include 'fun facts'." 
              },
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
      
      // 3. Convert GPT response to speech and play it
      const speech = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(speech);

    } catch (error) {
      console.error('Error:', error);
      setResponse('Error processing image');
    } finally {
      setIsLoading(false);
    }
  };

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