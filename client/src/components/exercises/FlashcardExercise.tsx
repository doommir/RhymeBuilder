import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FlashcardExerciseProps {
  term: string;
  definition: string;
  onComplete: (correct: boolean) => void;
}

export default function FlashcardExercise({ term, definition, onComplete }: FlashcardExerciseProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    }
  };

  const handleComplete = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      // Play success sound
      window.sfx.playCorrect();
      // Flashcards are always "correct" since they're passive learning
      onComplete(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto">
      <div 
        className="w-full h-64 cursor-pointer relative mb-8"
        onClick={handleFlip}
      >
        <div className="absolute inset-0 transition-all duration-500">
          <Card className={`w-full h-full border-2 ${isFlipped ? 'opacity-0 pointer-events-none' : 'border-secondary'}`}>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              <h3 className="text-2xl font-bold mb-4">{term}</h3>
              <p className="text-center text-gray-500 text-sm mt-2">Tap to flip</p>
            </div>
          </Card>
        </div>
        
        <div className="absolute inset-0 transition-all duration-500">
          <Card className={`w-full h-full border-2 ${isFlipped ? 'border-primary' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              <p className="text-lg text-center">{definition}</p>
              {isFlipped && !isCompleted && (
                <p className="text-center text-gray-500 text-sm mt-4">Tap "Got it" when you're ready</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-4 w-full">
        <Button
          className="w-full py-3 btn-primary rounded-lg text-lg font-semibold"
          disabled={!isFlipped || isCompleted}
          onClick={handleComplete}
        >
          {isCompleted ? "Completed! ✓" : "Got it!"}
        </Button>
      </div>
    </div>
  );
}