import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RhymePair {
  id: string;
  left: string;
  right: string;
}

interface RhymeMatchExerciseProps {
  pairs: RhymePair[];
  explanation?: string;
  onComplete: (correct: boolean) => void;
}

export default function RhymeMatchExercise({
  pairs,
  explanation,
  onComplete
}: RhymeMatchExerciseProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matches, setMatches] = useState<string[]>([]);
  const [attempts, setAttempts] = useState<{ left: string; right: string; correct: boolean }[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Shuffle the right column options for display
  const [shuffledRightOptions] = useState(() => {
    return [...pairs].sort(() => Math.random() - 0.5).map(pair => ({
      id: pair.id,
      text: pair.right
    }));
  });

  const handleLeftSelect = (pairId: string) => {
    if (isCompleted || matches.includes(pairId)) return;
    setSelectedLeft(pairId);
  };

  const handleRightSelect = (pairId: string) => {
    if (isCompleted || matches.includes(pairId)) return;
    setSelectedRight(pairId);
  };

  // Check if a matching attempt was made
  const checkMatch = () => {
    if (selectedLeft && selectedRight) {
      const isCorrect = selectedLeft === selectedRight;
      
      // Play sound based on correctness
      if (isCorrect) {
        window.sfx?.playCorrect?.();
        // Add to matched pairs
        setMatches(prev => [...prev, selectedLeft]);
      } else {
        window.sfx?.playIncorrect?.();
      }
      
      // Record the attempt
      setAttempts(prev => [
        ...prev,
        {
          left: selectedLeft,
          right: selectedRight,
          correct: isCorrect
        }
      ]);
      
      // Reset selections
      setSelectedLeft(null);
      setSelectedRight(null);
      
      // Check if all pairs are matched
      if (isCorrect && matches.length + 1 === pairs.length - 1) {
        setIsCompleted(true);
        setTimeout(() => {
          window.sfx?.playComplete?.();
          onComplete(true);
        }, 1000);
      }
    }
  };

  // Automatically check match when both selections are made
  if (selectedLeft && selectedRight) {
    setTimeout(checkMatch, 300);
  }

  // Find a pair by ID
  const getPairById = (id: string) => pairs.find(pair => pair.id === id);
  
  // Check if a pair has been matched
  const isPairMatched = (id: string) => matches.includes(id);
  
  // Get the styling for a left option
  const getLeftOptionClass = (id: string) => {
    if (isPairMatched(id)) return "bg-green-100 border-green-500 text-green-700";
    if (selectedLeft === id) return "bg-secondary/20 border-secondary";
    return "bg-white hover:bg-gray-50";
  };
  
  // Get the styling for a right option
  const getRightOptionClass = (id: string) => {
    if (isPairMatched(id)) return "bg-green-100 border-green-500 text-green-700";
    if (selectedRight === id) return "bg-secondary/20 border-secondary";
    return "bg-white hover:bg-gray-50";
  };

  return (
    <div className="w-full">
      <Card className="p-6 border-2">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column (source words) */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-3">Source Words</h3>
            <div className="grid gap-3">
              {pairs.map(pair => (
                <div
                  key={`left-${pair.id}`}
                  className={`
                    p-3 rounded-lg border-2 text-center cursor-pointer transition
                    ${getLeftOptionClass(pair.id)}
                    ${isPairMatched(pair.id) ? "cursor-default" : ""}
                  `}
                  onClick={() => handleLeftSelect(pair.id)}
                >
                  {pair.left}
                </div>
              ))}
            </div>
          </div>
          
          {/* Right column (target rhymes) */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-3">Target Rhymes</h3>
            <div className="grid gap-3">
              {shuffledRightOptions.map(option => {
                const pairId = option.id;
                return (
                  <div
                    key={`right-${pairId}`}
                    className={`
                      p-3 rounded-lg border-2 text-center cursor-pointer transition
                      ${getRightOptionClass(pairId)}
                      ${isPairMatched(pairId) ? "cursor-default" : ""}
                    `}
                    onClick={() => handleRightSelect(pairId)}
                  >
                    {option.text}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Match each word on the left with its rhyming partner on the right.
          </p>
        </div>
        
        {/* Manual "Continue" button if stuck */}
        {(attempts.length > pairs.length * 2) && !isCompleted && (
          <div className="mt-6 flex justify-end">
            <Button
              className="btn-primary"
              onClick={() => onComplete(false)}
            >
              Continue
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}