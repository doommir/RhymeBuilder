import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TapWordExerciseProps {
  correctSequence: string[];
  wordOptions: string[];
  onComplete: (correct: boolean) => void;
}

export default function TapWordExercise({ 
  correctSequence, 
  wordOptions, 
  onComplete 
}: TapWordExerciseProps) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds timer
  const [timerActive, setTimerActive] = useState(true);

  // Start timer
  useEffect(() => {
    if (!timerActive || isCompleted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timerActive, isCompleted]);

  const handleWordSelect = (word: string) => {
    if (isCompleted) return;
    
    // If word is already selected, do nothing
    if (selectedWords.includes(word)) return;
    
    // Add word to selected words
    setSelectedWords(prev => [...prev, word]);
  };

  const handleRemoveWord = (index: number) => {
    if (isCompleted) return;
    
    setSelectedWords(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (isCompleted) return;
    
    setTimerActive(false);
    
    // Check if the sequence is correct (all words in correct order)
    const sequenceCorrect = selectedWords.length === correctSequence.length && 
      selectedWords.every((word, index) => word === correctSequence[index]);
    
    // Set correctness
    setIsCorrect(sequenceCorrect);
    setIsCompleted(true);
    
    // Play sound based on correctness
    if (sequenceCorrect) {
      window.sfx.playCorrect();
      
      // Delay completion to show feedback
      setTimeout(() => {
        onComplete(true);
      }, 1500);
    } else {
      window.sfx.playIncorrect();
    }
  };

  const handleTryAgain = () => {
    setSelectedWords([]);
    setIsCompleted(false);
    setIsCorrect(false);
    setTimeLeft(30);
    setTimerActive(true);
  };

  const handleContinue = () => {
    onComplete(false);
  };

  const getTimeColor = () => {
    if (timeLeft > 15) return 'text-green-500';
    if (timeLeft > 5) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <div className="font-semibold">Tap words in order to create a rhyming flow</div>
        <div className={`font-bold ${getTimeColor()}`}>
          {timeLeft}s
        </div>
      </div>
      
      <Card className="border-2 border-secondary/30 p-4 mb-6">
        <div className="min-h-20 p-2 border border-dashed border-gray-300 rounded-lg bg-gray-50 mb-4 flex flex-wrap gap-2">
          {selectedWords.length === 0 ? (
            <div className="w-full text-center text-gray-400 py-4">
              Tap words below to build your flow
            </div>
          ) : (
            selectedWords.map((word, index) => (
              <Badge 
                key={`selected-${index}`}
                className={`px-3 py-1.5 text-base cursor-pointer select-none ${
                  isCompleted 
                    ? (correctSequence[index] === word ? 'bg-green-500' : 'bg-red-500') 
                    : 'bg-secondary'
                }`}
                onClick={() => !isCompleted && handleRemoveWord(index)}
              >
                {word}
                {!isCompleted && <i className="ri-close-line ml-1 text-xs"></i>}
              </Badge>
            ))
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {wordOptions.map((word, index) => (
            <Badge
              key={`option-${index}`}
              variant="outline"
              className={`px-3 py-1.5 text-base cursor-pointer select-none ${
                selectedWords.includes(word) ? 'opacity-50 pointer-events-none' : ''
              } ${isCompleted ? 'pointer-events-none' : ''}`}
              onClick={() => handleWordSelect(word)}
            >
              {word}
            </Badge>
          ))}
        </div>
        
        {isCompleted && (
          <div className={`mt-4 p-3 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect 
                ? "Perfect! You've created a correct flow." 
                : "Not quite right. Here's the correct sequence:"}
            </p>
            {!isCorrect && (
              <div className="mt-2 flex flex-wrap gap-1">
                {correctSequence.map((word, index) => (
                  <Badge 
                    key={`correct-${index}`}
                    className="bg-green-500 px-2 py-1"
                  >
                    {word}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

      {!isCompleted ? (
        <Button
          className="w-full py-3 btn-primary rounded-lg text-lg font-semibold"
          disabled={selectedWords.length === 0}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      ) : !isCorrect ? (
        <div className="grid grid-cols-2 gap-4">
          <Button
            className="py-3 bg-amber-500 text-white hover:bg-amber-600 rounded-lg text-md font-semibold"
            onClick={handleTryAgain}
          >
            Try Again
          </Button>
          <Button
            className="py-3 bg-gray-500 text-white hover:bg-gray-600 rounded-lg text-md font-semibold"
            onClick={handleContinue}
          >
            Continue Anyway
          </Button>
        </div>
      ) : (
        <Button
          className="w-full py-3 bg-green-500 text-white hover:bg-green-600 rounded-lg text-lg font-semibold"
          disabled
        >
          Correct! ✓
        </Button>
      )}
    </div>
  );
}