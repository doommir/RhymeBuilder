import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RecallExercise } from "@/lib/new-lesson-data";

interface RecallPhaseProps {
  exercises: RecallExercise[];
  onComplete: (earnedXp: number, correctAnswers: number) => void;
}

export default function RecallPhase({ exercises, onComplete }: RecallPhaseProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  
  const currentExercise = exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === exercises.length - 1;
  
  // Progress percentage
  const progress = ((currentExerciseIndex + 1) / exercises.length) * 100;
  
  // Handle option selection
  const handleOptionSelect = (option: string) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(option);
    }
  };
  
  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (selectedAnswer && !isAnswerSubmitted) {
      setIsAnswerSubmitted(true);
      
      // Check if answer is correct
      const isCorrect = 
        selectedAnswer === currentExercise.type === 'multiple_choice' 
          ? currentExercise.correctAnswer 
          : currentExercise.type === 'fill_in_blank'
            ? currentExercise.correctAnswer
            : null;
      
      if (isCorrect) {
        // Add XP for correct answer
        setEarnedXp(prev => prev + currentExercise.xpReward);
        setCorrectAnswers(prev => prev + 1);
        
        // Play correct sound effect
        window.sfx?.playCorrect?.();
      } else if (currentExercise.type !== 'info_card') {
        // Play incorrect sound effect (only for questions with right/wrong answers)
        window.sfx?.playIncorrect?.();
      }
    }
  };
  
  // Handle next exercise
  const handleNextExercise = () => {
    if (isLastExercise) {
      // Complete the recall phase
      onComplete(earnedXp, correctAnswers);
    } else {
      // Move to next exercise
      setCurrentExerciseIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    }
  };
  
  // Render info card exercise
  const renderInfoCard = () => {
    const { question, content } = currentExercise as { question: string, content: string };
    
    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">{question}</h3>
        <Card className="p-6 border-2 bg-white">
          <p className="text-lg">{content}</p>
        </Card>
      </div>
    );
  };
  
  // Render multiple choice exercise
  const renderMultipleChoice = () => {
    const { question, options, correctAnswer } = currentExercise as { 
      question: string,
      options: string[],
      correctAnswer: string
    };
    
    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">{question}</h3>
        <div className="space-y-3">
          {options.map((option, index) => (
            <div
              key={index}
              className={`
                p-4 border-2 rounded-lg cursor-pointer transition-all
                ${selectedAnswer === option ? 'border-secondary bg-secondary/10' : 'hover:border-gray-400'}
                ${isAnswerSubmitted && option === correctAnswer ? 'border-green-500 bg-green-50' : ''}
                ${isAnswerSubmitted && selectedAnswer === option && option !== correctAnswer ? 'border-red-500 bg-red-50' : ''}
              `}
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render fill in blank exercise
  const renderFillInBlank = () => {
    const { question, content, options, blankIndex, correctAnswer } = currentExercise as {
      question: string,
      content: string,
      options: string[],
      blankIndex: number,
      correctAnswer: string
    };
    
    // Split content into parts before and after the blank
    const contentParts = content.split(' ');
    const beforeBlank = contentParts.slice(0, blankIndex).join(' ');
    const afterBlank = contentParts.slice(blankIndex + 1).join(' ');
    
    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">{question}</h3>
        
        <div className="p-4 border rounded-lg bg-white mb-4">
          <p className="text-lg">
            {beforeBlank}{' '}
            <span className="inline-block min-w-[80px] px-2 mx-1 border-b-2 border-dashed border-secondary text-center">
              {selectedAnswer || '_____'}
            </span>
            {' '}{afterBlank}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {options.map((option, index) => (
            <div
              key={index}
              className={`
                p-3 border-2 rounded-lg text-center cursor-pointer transition-all
                ${selectedAnswer === option ? 'border-secondary bg-secondary/10' : 'hover:border-gray-400'}
                ${isAnswerSubmitted && option === correctAnswer ? 'border-green-500 bg-green-50' : ''}
                ${isAnswerSubmitted && selectedAnswer === option && option !== correctAnswer ? 'border-red-500 bg-red-50' : ''}
              `}
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render the appropriate exercise based on type
  const renderExercise = () => {
    switch (currentExercise.type) {
      case 'info_card':
        return renderInfoCard();
      case 'multiple_choice':
        return renderMultipleChoice();
      case 'fill_in_blank':
        return renderFillInBlank();
      default:
        return <div>Unknown exercise type</div>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-6 border-2 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold gradient-text">Knowledge Check</h2>
          <Badge variant="outline" className="bg-secondary/10 text-secondary font-semibold">
            Exercise {currentExerciseIndex + 1} of {exercises.length}
          </Badge>
        </div>
        
        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-secondary transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Current exercise */}
        {renderExercise()}
        
        {/* Navigation buttons */}
        <div className="flex justify-end">
          {!isAnswerSubmitted ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer && currentExercise.type !== 'info_card'}
              className="btn-primary"
            >
              {currentExercise.type === 'info_card' ? 'Got it!' : 'Check Answer'}
            </Button>
          ) : (
            <Button
              onClick={handleNextExercise}
              className="btn-primary"
            >
              {isLastExercise ? 'Complete Lesson' : 'Next Question'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}