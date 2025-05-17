import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface FillBlankExerciseProps {
  sentence: string;
  blankIndex: number;
  options: Option[];
  explanation?: string;
  onComplete: (correct: boolean) => void;
}

export default function FillBlankExercise({ 
  sentence, 
  blankIndex, 
  options, 
  explanation, 
  onComplete 
}: FillBlankExerciseProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Split the sentence into parts before and after the blank
  const words = sentence.split(' ');
  const beforeBlank = words.slice(0, blankIndex).join(' ');
  const afterBlank = words.slice(blankIndex + 1).join(' ');

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
        window.sfx.playCorrect();
      } else {
        window.sfx.playIncorrect();
      }
      
      setIsCorrect(correct);
      setIsSubmitted(true);
      
      // We don't call onComplete right away for wrong answers to allow the user to see feedback
      if (correct) {
        setTimeout(() => {
          onComplete(correct);
        }, 1000);
      }
    }
  };

  const handleContinue = () => {
    onComplete(false); // Continue after seeing feedback for wrong answer
  };

  const getOptionClassName = (option: Option) => {
    if (!isSubmitted) {
      return `border-2 ${selectedOption === option.id ? 'border-secondary bg-secondary/10' : 'border-gray-200'}`;
    }
    
    if (option.isCorrect) {
      return 'border-2 border-green-500 bg-green-50';
    }
    
    if (selectedOption === option.id && !option.isCorrect) {
      return 'border-2 border-red-500 bg-red-50';
    }
    
    return 'border-2 border-gray-200 opacity-50';
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-8">
        <Card className="p-6 border-2 border-secondary/30">
          <p className="text-xl text-center mb-6">
            {beforeBlank}{' '}
            <span className="inline-block min-w-[60px] px-3 py-1 text-center border-b-2 border-dashed border-secondary">
              {isSubmitted && (
                <span className={isCorrect ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                  {options.find(opt => opt.id === selectedOption)?.text || '___'}
                </span>
              )}
              {!isSubmitted && (selectedOption ? 
                <span className="text-secondary font-bold">
                  {options.find(opt => opt.id === selectedOption)?.text || '___'}
                </span> 
                : '___')}
            </span>{' '}
            {afterBlank}
          </p>
          
          <div className="space-y-3">
            {options.map(option => (
              <div 
                key={option.id}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${getOptionClassName(option)}`}
                onClick={() => handleOptionSelect(option.id)}
              >
                <div className="flex-grow">
                  <p>{option.text}</p>
                </div>
                {isSubmitted && option.isCorrect && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <i className="ri-check-line text-white"></i>
                  </div>
                )}
                {isSubmitted && selectedOption === option.id && !option.isCorrect && (
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <i className="ri-close-line text-white"></i>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {isSubmitted && !isCorrect && explanation && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">{explanation}</p>
            </div>
          )}
        </Card>
      </div>

      {!isSubmitted ? (
        <Button
          className="w-full py-3 btn-primary rounded-lg text-lg font-semibold"
          disabled={!selectedOption}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      ) : !isCorrect ? (
        <Button
          className="w-full py-3 bg-amber-500 text-white hover:bg-amber-600 rounded-lg text-lg font-semibold"
          onClick={handleContinue}
        >
          Continue
        </Button>
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