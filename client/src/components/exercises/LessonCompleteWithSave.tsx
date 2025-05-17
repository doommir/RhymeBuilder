import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { saveToRhymePad } from "@/hooks/use-rhymepad";
import { useToast } from "@/hooks/use-toast";

interface LessonCompleteWithSaveProps {
  xp: number;
  totalXp: number;
  correctAnswers: number;
  totalExercises: number;
  nextLevel: number;
  fillerPhrase?: string;
  fillerPhraseTags?: string[];
  lessonId: string;
  onContinue: () => void;
}

export default function LessonCompleteWithSave({
  xp,
  totalXp,
  correctAnswers,
  totalExercises,
  nextLevel,
  fillerPhrase,
  fillerPhraseTags = [],
  lessonId,
  onContinue
}: LessonCompleteWithSaveProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  // Animation for XP progress
  useEffect(() => {
    // Show confetti animation
    setShowConfetti(true);
    
    // Animate progress bar
    const timer = setTimeout(() => {
      setProgress(100);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Save the filler phrase to RhymePad
  useEffect(() => {
    if (fillerPhrase) {
      const saved = saveToRhymePad(fillerPhrase, fillerPhraseTags, lessonId);
      if (saved) {
        setTimeout(() => {
          toast({
            title: "Added to your Flow Vault!",
            description: "This phrase was saved to your collection",
          });
        }, 1500);
      }
    }
  }, [fillerPhrase, fillerPhraseTags, lessonId, toast]);

  // Calculate percentages
  const scorePercent = Math.round((correctAnswers / totalExercises) * 100);
  const xpPercent = Math.round((xp / totalXp) * 100);

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <Card className="p-6 border-4 border-primary/20 relative overflow-hidden">
        {/* Confetti effect */}
        {showConfetti && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {/* This is where we'd implement confetti effect */}
            <div className="absolute top-2 right-2 text-2xl animation-bounce">🎉</div>
            <div className="absolute top-10 left-10 text-xl animation-bounce">🎊</div>
            <div className="absolute bottom-10 right-20 text-3xl animation-bounce">🎯</div>
          </div>
        )}
        
        <h2 className="text-2xl font-bold text-center mb-6 gradient-text">Lesson Complete!</h2>
        
        <div className="space-y-6">
          {/* Score */}
          <div>
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">Score</h3>
              <span>{correctAnswers} of {totalExercises} correct</span>
            </div>
            <Progress value={scorePercent} className="h-2" />
          </div>
          
          {/* XP earned */}
          <div>
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">XP Earned</h3>
              <span>{xp} XP</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Learned phrases */}
          {fillerPhrase && (
            <div className="bg-secondary/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Phrase added to your Flow Vault:</h3>
              <p className="text-lg font-medium">"{fillerPhrase}"</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {fillerPhraseTags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="bg-secondary/20">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Next level */}
          <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-blue-700">Next Level</p>
              <p className="font-bold text-xl text-blue-800">Level {nextLevel}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <Button
            className="w-full text-lg py-6 btn-primary"
            onClick={onContinue}
          >
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
}