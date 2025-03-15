import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Camera, CameraOff, RefreshCw, Pause, Play } from "lucide-react";
import EmotionDisplay from './EmotionDisplay';
import { cn } from '@/lib/utils';
import { useEmotionDetector } from '@/hooks/useEmotionDetector';

const CameraView = () => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  
  const {
    startDetection,
    stopDetection,
    currentEmotion,
    emotionConfidence,
    emotionHistory,
    faceDetected,
    isProcessing,
    resetEmotionData
  } = useEmotionDetector(videoRef, canvasRef);

  // Check if camera permissions are already granted
  const checkCameraPermissions = async () => {
    try {
      console.log("Checking camera permissions...");
      // Try to get the permission state for camera
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
        console.log("Permission status:", result.state);
        
        if (result.state === "denied") {
          setPermissionDenied(true);
          return false;
        }
      } else {
        console.log("Permissions API not supported, falling back to direct access attempt");
      }
      return true;
    } catch (error) {
      console.error("Error checking camera permissions:", error);
      return true; // Continue anyway if we can't check permissions
    }
  };

  const startCamera = async () => {
    setIsLoading(true);
    console.log("Starting camera activation...");
    
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("getUserMedia is not supported in this browser");
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Navigateur non compatible",
        description: "Votre navigateur ne prend pas en charge l'accès à la caméra. Veuillez essayer avec Chrome, Firefox, ou Edge récent.",
        duration: 7000
      });
      return;
    }
    
    // First check permissions
    const permissionsGranted = await checkCameraPermissions();
    if (!permissionsGranted) {
      console.log("Camera permissions denied");
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Accès à la caméra refusé",
        description: "Veuillez autoriser l'accès à la caméra dans les paramètres de votre navigateur.",
        duration: 6000
      });
      return;
    }
    
    try {
      if (!videoRef.current) {
        console.error("Video reference is null");
        return;
      }
      
      console.log("Requesting user media...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      
      console.log("Stream obtained successfully:", stream);
      videoRef.current.srcObject = stream;
      setCameraActive(true);
      
      // Start detection once video is ready
      videoRef.current.onloadeddata = () => {
        console.log("Video loaded, starting detection...");
        setIsLoading(false);
        startDetection();
      };
      
      toast({
        title: "Caméra activée",
        description: "La détection d'émotions va commencer automatiquement."
      });
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsLoading(false);
      setCameraActive(false);
      
      // Check if the error is a permission denial
      if (error instanceof DOMException && (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError')) {
        console.log("Permission explicitly denied by user");
        setPermissionDenied(true);
        toast({
          variant: "destructive",
          title: "Accès à la caméra refusé",
          description: "Veuillez autoriser l'accès à la caméra dans les paramètres de votre navigateur.",
          duration: 6000
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur d'accès à la caméra",
          description: "Veuillez vérifier les permissions de la caméra dans votre navigateur.",
          duration: 6000
        });
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    stopDetection();
    setCameraActive(false);
    resetEmotionData();
    
    toast({
      title: "Caméra désactivée",
      description: "La détection d'émotions a été arrêtée."
    });
  };

  const togglePause = () => {
    if (isPaused) {
      startDetection();
      toast({
        title: "Détection réactivée",
        description: "L'analyse des émotions a repris."
      });
    } else {
      stopDetection();
      toast({
        title: "Détection en pause",
        description: "L'analyse des émotions est actuellement en pause."
      });
    }
    setIsPaused(!isPaused);
  };

  const restartDetection = () => {
    stopDetection();
    resetEmotionData();
    setTimeout(() => {
      startDetection();
      toast({
        title: "Détection redémarrée",
        description: "L'analyse des émotions a été réinitialisée."
      });
    }, 100);
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      stopDetection();
    };
  }, [stopDetection]);

  return (
    <div className="w-full flex flex-col space-y-6 animate-fade-in">
      <Card className="w-full overflow-hidden border rounded-2xl shadow-soft glass-morphism">
        <div className="relative camera-container aspect-video">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black rounded-t-2xl">
              <Skeleton className="w-full h-full rounded-t-2xl" />
            </div>
          )}
          
          <video 
            ref={videoRef} 
            className={cn(
              "w-full h-auto transition-opacity duration-300", 
              isLoading ? "opacity-0" : "opacity-100"
            )}
            autoPlay 
            playsInline 
            muted
          />
          
          {/* Canvas overlay for face detection visualization */}
          <canvas 
            ref={canvasRef} 
            className="canvas-overlay"
          />
          
          {/* Status indicator */}
          {cameraActive && (
            <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/60 backdrop-blur-sm p-2 rounded-full">
              <div className={cn(
                "w-3 h-3 rounded-full", 
                isProcessing ? "bg-green-500 animate-pulse-slow" : "bg-yellow-500"
              )} />
              <span className="text-xs font-medium text-white">
                {isProcessing ? "Détection active" : "En attente..."}
              </span>
            </div>
          )}
          
          {/* Face detection indicator */}
          {cameraActive && faceDetected !== null && (
            <div className={cn(
              "absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm p-2 rounded-full transition-opacity duration-300",
              faceDetected ? "opacity-100" : "opacity-70"
            )}>
              <span className="text-sm font-medium text-white">
                {faceDetected ? "Visage détecté" : "Aucun visage détecté"}
              </span>
            </div>
          )}
        </div>
        
        {/* Camera controls */}
        <div className="flex justify-between items-center p-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm">
          <div className="flex space-x-2">
            {permissionDenied ? (
              <Button 
                onClick={() => window.location.reload()}
                className="button-hover bg-destructive"
              >
                <Camera className="mr-2 h-4 w-4" />
                Réessayer l'accès à la caméra
              </Button>
            ) : !cameraActive ? (
              <Button 
                onClick={() => {
                  console.log("Camera button clicked");
                  startCamera();
                }}
                className="button-hover"
                disabled={isLoading}
              >
                <Camera className="mr-2 h-4 w-4" />
                Activer la caméra
              </Button>
            ) : (
              <>
                <Button 
                  onClick={togglePause}
                  variant="outline"
                  className="button-hover"
                >
                  {isPaused ? (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Reprendre
                    </>
                  ) : (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={restartDetection}
                  variant="outline"
                  className="button-hover"
                  disabled={isPaused}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Réinitialiser
                </Button>
              </>
            )}
          </div>
          
          {cameraActive && (
            <Button 
              onClick={stopCamera}
              variant="ghost"
              className="button-hover text-destructive hover:text-destructive"
            >
              <CameraOff className="mr-2 h-4 w-4" />
              Désactiver
            </Button>
          )}
        </div>
      </Card>
      
      {/* Emotion display section */}
      {cameraActive && (
        <Tabs defaultValue="current" className="w-full animate-slide-up">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Émotion actuelle</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="mt-4">
            <EmotionDisplay 
              currentEmotion={currentEmotion} 
              confidence={emotionConfidence}
              faceDetected={faceDetected}
            />
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">
                Historique des émotions détectées
              </h3>
              <div className="flex flex-wrap gap-2">
                {emotionHistory.map((item, index) => (
                  <div 
                    key={index}
                    className="px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `hsl(var(--${item.emotion.toLowerCase()}) / 0.2)`,
                      color: `hsl(var(--${item.emotion.toLowerCase()}) / 1)`
                    }}
                  >
                    {item.emotion} ({Math.round(item.confidence * 100)}%)
                  </div>
                ))}
                {emotionHistory.length === 0 && (
                  <p className="text-muted-foreground">
                    Aucune émotion n'a encore été détectée.
                  </p>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default CameraView;
