import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/hooks/use-user";

interface CompletionPhaseProps {
  lessonId: string;
  earnedXp: number;
  correctAnswers: number;
  totalExercises: number;
  onComplete: () => void;
}

export default function CompletionPhase({
  lessonId,
  earnedXp,
  correctAnswers,
  totalExercises,
  onComplete
}: CompletionPhaseProps) {
  const { user, completeLesson } = useUser();
  const [showConfetti, setShowConfetti] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Mark lesson as completed
    if (user) {
      completeLesson(lessonId, earnedXp);
    }
    
    // Show confetti animation
    setShowConfetti(true);
    
    // Play completion sound
    window.sfx?.playComplete?.();
    
    // Animate progress
    const timer = setTimeout(() => {
      setProgress(100);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [user, completeLesson, lessonId, earnedXp]);
  
  // Calculate percentages
  const scorePercent = Math.round((correctAnswers / totalExercises) * 100);
  
  // Calculate the next level based on current XP
  const getNextLevel = () => {
    if (!user) return 1;
    return user.level ? user.level + 1 : 2;
  };

  return (
    <div className="max-w-lg mx-auto">
      <Card className="p-6 border-4 border-primary/20 relative overflow-hidden">
        {/* Confetti effect */}
        {showConfetti && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {/* Simple confetti animation */}
            <div className="absolute top-2 right-2 text-2xl animation-bounce">🎉</div>
            <div className="absolute top-10 left-10 text-xl animation-bounce">🎊</div>
            <div className="absolute bottom-10 right-20 text-3xl animation-bounce">🏆</div>
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
              <span>{earnedXp} XP</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Next level */}
          <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-blue-700">Next Level</p>
              <p className="font-bold text-xl text-blue-800">Level {getNextLevel()}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {/* Vault entries saved note (if any were saved during the lesson) */}
          <div className="bg-secondary/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Flow Vault Updated</h3>
            <p className="text-sm">
              All your notes and selected freestyle lines have been saved to your Flow Vault
              for future reference and practice.
            </p>
          </div>
          
          <Button
            className="w-full text-lg py-6 btn-primary"
            onClick={onComplete}
          >
            Return to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}