import { useRef, useState, useCallback, useEffect } from 'react';
import * as faceapi from 'face-api.js';

export type Emotion = 'neutral' | 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise';

type EmotionHistoryItem = {
  emotion: string;
  confidence: number;
  timestamp: number;
};

export const useEmotionDetector = (
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [emotionConfidence, setEmotionConfidence] = useState<number>(0);
  const [emotionHistory, setEmotionHistory] = useState<EmotionHistoryItem[]>([]);
  const [faceDetected, setFaceDetected] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const detectionRef = useRef<number | null>(null);
  const isRunningRef = useRef<boolean>(false);
  
  // Normalize emotion names from face-api.js to our Emotion type
  const normalizeEmotionName = (emotion: string): string => {
    switch (emotion) {
      case 'happy': return 'joy';
      case 'sad': return 'sadness';
      case 'angry': return 'anger';
      case 'fearful': return 'fear';
      case 'surprised': return 'surprise';
      case 'neutral': return 'neutral';
      default: return emotion;
    }
  };

  // Load face detection models
  const loadModels = useCallback(async () => {
    try {
      // Use a CDN URL instead of local models
      const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
      ]);
      
      console.log('Face detection models loaded successfully');
      setModelsLoaded(true);
    } catch (error) {
      console.error('Error loading models:', error);
    }
  }, []);

  useEffect(() => {
    loadModels();
    
    // Clean up function
    return () => {
      if (detectionRef.current) {
        cancelAnimationFrame(detectionRef.current);
      }
      isRunningRef.current = false;
    };
  }, [loadModels]);

  // Process emotions and update state
  const processEmotion = useCallback((expressions: faceapi.FaceExpressions) => {
    // Convert expressions to array of objects
    const emotionsArray = Object.entries(expressions).map(([emotion, confidence]) => ({
      emotion: normalizeEmotionName(emotion),
      confidence
    }));
    
    // Sort by confidence and get the most confident emotion
    const sortedEmotions = emotionsArray.sort((a, b) => b.confidence - a.confidence);
    const topEmotion = sortedEmotions[0];
    
    if (topEmotion && topEmotion.confidence > 0.5) {
      const emotionName = topEmotion.emotion;
      
      // Update current emotion if it's different or has significantly changed in confidence
      if (currentEmotion !== emotionName || Math.abs(emotionConfidence - topEmotion.confidence) > 0.15) {
        setCurrentEmotion(emotionName);
        setEmotionConfidence(topEmotion.confidence);
        
        // Add to history only if the emotion changes
        if (currentEmotion !== emotionName) {
          setEmotionHistory(prev => {
            const newHistory = [...prev, {
              emotion: emotionName,
              confidence: topEmotion.confidence,
              timestamp: Date.now()
            }];
            
            // Keep only the last 10 emotions
            return newHistory.slice(-10);
          });
        }
      }
    }
  }, [currentEmotion, emotionConfidence]);

  // Detect emotions in a frame
  const detectEmotions = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !modelsLoaded || !isRunningRef.current) {
      return;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video.paused || video.ended || !video.readyState) {
      detectionRef.current = requestAnimationFrame(detectEmotions);
      return;
    }
    
    // Set dimensions
    const displaySize = {
      width: video.clientWidth,
      height: video.clientHeight
    };
    
    // Only resize if dimensions have changed
    if (canvas.width !== displaySize.width || canvas.height !== displaySize.height) {
      faceapi.matchDimensions(canvas, displaySize);
    }
    
    // Start processing
    setIsProcessing(true);
    
    try {
      // Detect faces with expressions
      const detections = await faceapi.detectAllFaces(
        video, 
        new faceapi.TinyFaceDetectorOptions({ inputSize: 224 })
      )
      .withFaceLandmarks()
      .withFaceExpressions();
      
      // Process detections
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      
      // Clear canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      // Update face detection status
      setFaceDetected(resizedDetections.length > 0);
      
      // Draw detections
      if (resizedDetections.length > 0) {
        // Draw face landmarks with light lines
        ctx!.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx!.lineWidth = 2;
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        
        // Get bounding box for face
        const detection = resizedDetections[0];
        
        // Process detected emotions
        processEmotion(detection.expressions);
        
        // Draw custom box instead of the default one
        const { box } = detection.detection;
        ctx!.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx!.lineWidth = 2;
        ctx!.setLineDash([5, 5]);
        ctx!.strokeRect(box.x, box.y, box.width, box.height);
        ctx!.setLineDash([]);
      } else {
        // No face detected
        if (faceDetected) {
          // Reset emotion after a delay
          setTimeout(() => {
            if (!faceDetected) {
              setCurrentEmotion(null);
            }
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error in emotion detection:', error);
    }
    
    // Continue detection loop
    detectionRef.current = requestAnimationFrame(detectEmotions);
    setIsProcessing(true);
  }, [videoRef, canvasRef, modelsLoaded, processEmotion, faceDetected]);

  // Start emotion detection
  const startDetection = useCallback(() => {
    if (!isRunningRef.current && modelsLoaded && videoRef.current) {
      isRunningRef.current = true;
      detectionRef.current = requestAnimationFrame(detectEmotions);
    }
  }, [detectEmotions, modelsLoaded, videoRef]);

  // Stop emotion detection
  const stopDetection = useCallback(() => {
    isRunningRef.current = false;
    if (detectionRef.current) {
      cancelAnimationFrame(detectionRef.current);
      detectionRef.current = null;
    }
    setIsProcessing(false);
  }, []);

  // Reset emotion data
  const resetEmotionData = useCallback(() => {
    setCurrentEmotion(null);
    setEmotionConfidence(0);
    setEmotionHistory([]);
    setFaceDetected(null);
  }, []);

  return {
    startDetection,
    stopDetection,
    currentEmotion,
    emotionConfidence,
    emotionHistory,
    faceDetected,
    isProcessing,
    resetEmotionData
  };
};
