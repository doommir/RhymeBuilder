import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Collection of motivational messages for lesson completion
const MOTIVATIONAL_MESSAGES = [
  "You're on fire! 🔥",
  "Bars on bars! Keep flowing! 📝",
  "Flow master in the making! 🎤",
  "That's how it's done! 💯",
  "Skills leveling up! 📈",
  "Rhymes getting tighter! 🔊",
  "You've got the rhythm! 🎵"
];

interface LessonCompleteProps {
  xp: number;
  totalXp: number;
  correctAnswers: number;
  totalExercises: number;
  nextLevel: number;
  onContinue: () => void;
}

export default function LessonComplete({ 
  xp, 
  totalXp, 
  correctAnswers,
  totalExercises,
  nextLevel,
  onContinue 
}: LessonCompleteProps) {
  // Play completion sound when modal is shown
  useEffect(() => {
    window.sfx.playComplete();
    
    // Prevent scrolling when modal is shown
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Get random motivational message
  const getRandomMotivationalMessage = () => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);
    return MOTIVATIONAL_MESSAGES[randomIndex];
  };

  const scorePercentage = Math.round((correctAnswers / totalExercises) * 100);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      <div className="absolute inset-0 bg-black bg-opacity-60" onClick={onContinue}></div>
      <Card className="relative z-10 w-full max-w-md animate-in slide-in-from-bottom-8 fade-in-50">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-medal-line text-green-600 text-4xl"></i>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Lesson Complete!</h2>
            <p className="text-lg font-medium text-primary mb-1">{getRandomMotivationalMessage()}</p>
            
            <div className="flex justify-center gap-6 my-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">{xp}</div>
                <div className="text-sm text-gray-500">XP Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">{correctAnswers}/{totalExercises}</div>
                <div className="text-sm text-gray-500">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">{scorePercentage}%</div>
                <div className="text-sm text-gray-500">Score</div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-700 mb-1">Next Level: {nextLevel}</div>
              <div className="xp-progress">
                <div className="xp-bar" style={{ width: `${Math.min((totalXp) % 100, 100)}%` }}></div>
              </div>
            </div>
            
            <Button 
              className="w-full btn-primary py-3 rounded-lg font-semibold text-lg"
              onClick={onContinue}
            >
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}