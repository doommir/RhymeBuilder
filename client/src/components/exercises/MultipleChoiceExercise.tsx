import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface MultipleChoiceExerciseProps {
  options: Option[];
  explanation?: string;
  onComplete: (correct: boolean) => void;
}

export default function MultipleChoiceExercise({ 
  options, 
  explanation, 
  onComplete 
}: MultipleChoiceExerciseProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    if (!isSubmitted) {
      setSelectedOption(optionId);
    }
  };

  const handleSubmit = () => {
    if (selectedOption && !isSubmitted) {
      const selectedOpt = options.find(opt => opt.id === selectedOption);
      const correct = selectedOpt?.isCorrect || false;
      
      // Play sound based on correctness
      if (correct) {
        window.sfx?.playCorrect?.();
      } else {
        window.sfx?.playIncorrect?.();
      }
      
      setIsCorrect(correct);
      setIsSubmitted(true);
    }
  };

  const handleNext = () => {
    onComplete(isCorrect);
  };

  return (
    <div className="w-full">
      <Card className="p-6 border-2">
        <div className="grid gap-4">
          {options.map((option) => (
            <div
              key={option.id}
              className={`
                p-4 border-2 rounded-lg flex items-center justify-between cursor-pointer
                ${selectedOption === option.id ? 'question-option selected' : 'question-option'}
                ${isSubmitted && option.isCorrect ? 'feedback-correct' : ''}
                ${isSubmitted && selectedOption === option.id && !option.isCorrect ? 'feedback-incorrect' : ''}
              `}
              onClick={() => handleOptionSelect(option.id)}
            >
              <span className="text-lg">{option.text}</span>
              
              {/* Show feedback icons when submitted */}
              <div className="flex items-center">
                {isSubmitted && option.isCorrect && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {isSubmitted && selectedOption === option.id && !option.isCorrect && (
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Explanation shown if answer is incorrect */}
        {isSubmitted && !isCorrect && explanation && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">{explanation}</p>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="mt-6 flex justify-end">
          {!isSubmitted ? (
            <Button 
              className="btn-primary"
              onClick={handleSubmit}
              disabled={!selectedOption}
            >
              Check Answer
            </Button>
          ) : (
            <Button 
              className="btn-primary"
              onClick={handleNext}
            >
              {isCorrect ? "Next" : "Continue"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}