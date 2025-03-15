
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import { 
  Smile, Frown, Angry, 
  Flame, AlertCircle, Scan 
} from 'lucide-react';

type EmotionDisplayProps = {
  currentEmotion: string | null;
  confidence: number;
  faceDetected: boolean | null;
};

const EmotionDisplay: React.FC<EmotionDisplayProps> = ({ 
  currentEmotion, 
  confidence,
  faceDetected 
}) => {
  const getEmotionIcon = (emotion: string) => {
    switch(emotion.toLowerCase()) {
      case 'joy':
        return <Smile className="h-10 w-10" />;
      case 'sadness':
        return <Frown className="h-10 w-10" />;
      case 'anger':
        return <Angry className="h-10 w-10" />;
      case 'surprise':
        return <AlertCircle className="h-10 w-10" />;
      case 'fear':
        return <Flame className="h-10 w-10" />;
      default:
        return <Scan className="h-10 w-10" />;
    }
  };

  const getEmotionLabel = (emotion: string) => {
    switch(emotion.toLowerCase()) {
      case 'joy': return 'Joie';
      case 'sadness': return 'Tristesse';
      case 'anger': return 'Colère';
      case 'surprise': return 'Surprise';
      case 'fear': return 'Peur';
      case 'neutral': return 'Neutre';
      default: return emotion;
    }
  };

  const getEmotionClass = (emotion: string) => {
    return `text-[hsl(var(--${emotion.toLowerCase()}))]`;
  };

  if (!faceDetected) {
    return (
      <Card className="p-8 flex flex-col items-center justify-center text-center gap-4 glass-morphism animate-pulse-slow">
        <Scan className="h-16 w-16 text-muted-foreground opacity-50" />
        <div>
          <h3 className="text-xl font-medium text-muted-foreground">
            En attente de détection
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Placez-vous devant la caméra pour commencer l'analyse
          </p>
        </div>
      </Card>
    );
  }

  if (!currentEmotion) {
    return (
      <Card className="p-8 flex flex-col items-center justify-center text-center glass-morphism">
        <div className="animate-spin mb-4">
          <Scan className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium">Analyse en cours...</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Veuillez patienter pendant que nous analysons vos expressions faciales
        </p>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "p-8 flex flex-col items-center justify-center text-center gap-6 glass-morphism animate-scale-in",
      `border-[hsl(var(--${currentEmotion.toLowerCase()})_/_0.4)]`
    )}>
      <div className={cn(
        "rounded-full p-6 animate-float", 
        `bg-[hsl(var(--${currentEmotion.toLowerCase()})_/_0.1)]`
      )}>
        <div className={getEmotionClass(currentEmotion)}>
          {getEmotionIcon(currentEmotion)}
        </div>
      </div>
      
      <div>
        <h3 className={cn(
          "text-3xl font-semibold",
          getEmotionClass(currentEmotion)
        )}>
          {getEmotionLabel(currentEmotion)}
        </h3>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Confiance</span>
            <span className="text-sm font-medium">
              {Math.round(confidence * 100)}%
            </span>
          </div>
          <Progress 
            value={confidence * 100} 
            className={`h-2 bg-[hsl(var(--${currentEmotion.toLowerCase()})_/_0.2)]`}
          />
        </div>
      </div>
    </Card>
  );
};

export default EmotionDisplay;
