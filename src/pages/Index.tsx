import React, { useEffect } from 'react';
import CameraView from '@/components/CameraView';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Info, ExternalLink, Github } from 'lucide-react';
import * as faceapi from 'face-api.js';

const Index = () => {
  useEffect(() => {
    // Créer et charger les modèles quand la page est chargée
    const loadModels = async () => {
      try {
        // Use a CDN URL instead of local models
        const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        ]);
        
        console.log('Face detection models loaded successfully');
        
        toast({
          title: "Modèles chargés avec succès",
          description: "L'application est prête à être utilisée.",
          duration: 3000,
        });
      } catch (error) {
        console.error('Error loading models:', error);
        toast({
          variant: "destructive",
          title: "Erreur lors du chargement des modèles",
          description: "Veuillez rafraîchir la page et réessayer.",
          duration: 5000,
        });
      }
    };
    
    loadModels();
  }, []);

  // Cette fonction simulera le téléchargement des modèles depuis CDN
  const downloadFaceApiModels = async () => {
    toast({
      title: "Téléchargement des modèles",
      description: "Préparation de l'application pour la première utilisation...",
      duration: 3000,
    });

    try {
      // Using the official CDN URLs
      const modelUrls = {
        tinyFaceDetector: 'https://justadudewhohacks.github.io/face-api.js/models/tiny_face_detector_model-weights_manifest.json',
        faceExpression: 'https://justadudewhohacks.github.io/face-api.js/models/face_expression_model-weights_manifest.json',
        faceLandmark: 'https://justadudewhohacks.github.io/face-api.js/models/face_landmark_68_model-weights_manifest.json'
      };
      
      console.log('Model URLs prepared:', modelUrls);
      
      // Dans une vraie application, nous ferions un fetch de chaque modèle et les stockerions
      // Comme nous ne pouvons pas vraiment télécharger et stocker des fichiers dans cet environnement,
      // nous simulons simplement le processus
      
      setTimeout(() => {
        toast({
          title: "Modèles chargés avec succès",
          description: "L'application est prête à être utilisée.",
          duration: 3000,
        });
      }, 2000);
      
    } catch (error) {
      console.error('Error preparing models:', error);
      toast({
        variant: "destructive",
        title: "Erreur lors du chargement des modèles",
        description: "Veuillez rafraîchir la page et réessayer.",
        duration: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/50">
      <header className="w-full py-6 px-4 md:px-6 bg-white/80 backdrop-blur-md border-b border-border/40 animate-fade-in">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="mr-2 bg-primary text-primary-foreground p-2 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 3.5C5.67392 3.5 4.40215 4.02678 3.46447 4.96447C2.52678 5.90215 2 7.17392 2 8.5C2 11.5 4.5 13.5 7 16.5C9.5 13.5 12 11.5 12 8.5C12 7.17392 11.4732 5.90215 10.5355 4.96447C9.59785 4.02678 8.32608 3.5 7 3.5Z" fill="currentColor"/>
                  <path d="M17 3.5C15.6739 3.5 14.4021 4.02678 13.4645 4.96447C12.5268 5.90215 12 7.17392 12 8.5C12 11.5 14.5 13.5 17 16.5C19.5 13.5 22 11.5 22 8.5C22 7.17392 21.4732 5.90215 20.5355 4.96447C19.5979 4.02678 18.3261 3.5 17 3.5Z" fill="currentColor" fillOpacity="0.7"/>
                  <path d="M7 21.5C8.65685 21.5 10 20.1569 10 18.5C10 16.8431 8.65685 15.5 7 15.5C5.34315 15.5 4 16.8431 4 18.5C4 20.1569 5.34315 21.5 7 21.5Z" fill="currentColor" fillOpacity="0.5"/>
                  <path d="M17 21.5C18.6569 21.5 20 20.1569 20 18.5C20 16.8431 18.6569 15.5 17 15.5C15.3431 15.5 14 16.8431 14 18.5C14 20.1569 15.3431 21.5 17 21.5Z" fill="currentColor" fillOpacity="0.3"/>
                </svg>
              </div>
              <h1 className="text-2xl font-semibold">EmotionSense</h1>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" className="button-hover" asChild>
                <a href="https://github.com/search?q=facial+emotion+recognition" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  Code source
                </a>
              </Button>
              <Button className="button-hover" asChild>
                <a href="https://face-api.js.org/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Documentation
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <section className="mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Reconnaissance d'émotions</h2>
            <p className="text-muted-foreground mb-8">
              Utilisez votre caméra pour détecter et analyser les émotions en temps réel grâce à l'apprentissage automatique.
            </p>
            
            <CameraView />
          </section>
          
          <Separator className="my-12" />
          
          <section className="grid md:grid-cols-2 gap-8 animate-fade-in">
            <Card className="p-6 glass-morphism card-hover">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2 text-primary" />
                À propos de cette application
              </h3>
              <p className="text-sm text-muted-foreground">
                Cette application utilise la bibliothèque face-api.js, une implémentation JavaScript de modèles de reconnaissance faciale. La détection des émotions est effectuée directement dans votre navigateur, ce qui garantit que vos données restent privées et ne sont jamais envoyées à un serveur externe.
              </p>
            </Card>
            
            <Card className="p-6 glass-morphism card-hover">
              <h3 className="text-xl font-semibold mb-4">Émotions détectées</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--joy))]" />
                  <span>Joie</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--sadness))]" />
                  <span>Tristesse</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--anger))]" />
                  <span>Colère</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--surprise))]" />
                  <span>Surprise</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--fear))]" />
                  <span>Peur</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--neutral))]" />
                  <span>Neutre</span>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </main>
      
      <footer className="w-full py-6 px-4 md:px-6 border-t border-border/40 bg-white/80 backdrop-blur-md mt-12">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} EmotionSense - Reconnaissance d'émotions en temps réel
            </p>
            <p className="text-sm text-muted-foreground mt-2 md:mt-0">
              Construit avec face-api.js et React
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
