import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FlashcardExercise from "./FlashcardExercise";
import FillBlankExercise from "./FillBlankExercise";
import TapWordExercise from "./TapWordExercise";
import MultipleChoiceExercise from "./MultipleChoiceExercise";
import RhymeMatchExercise from "./RhymeMatchExercise";

// Define all possible exercise types
export type ExerciseType = 
  | 'flashcard'
  | 'fill-blank'
  | 'tap-word'
  | 'multiple-choice'
  | 'info_card'
  | 'rhyme_match';

// Common properties for all exercise types
interface BaseExercise {
  id: string;
  type: ExerciseType;
  question: string;
  explanation?: string;
  xpReward: number;
}

// Type definitions for different exercise types
interface FlashcardExerciseData extends BaseExercise {
  type: 'flashcard';
  term: string;
  definition: string;
}

interface InfoCardExerciseData extends BaseExercise {
  type: 'info_card';
  term: string;
  definition: string;
}

interface FillBlankExerciseData extends BaseExercise {
  type: 'fill-blank';
  sentence: string;
  blankIndex: number;
  options: Array<{id: string, text: string, isCorrect: boolean}>;
}

interface TapWordExerciseData extends BaseExercise {
  type: 'tap-word';
  correctSequence: string[];
  wordOptions: string[];
}

interface MultipleChoiceExerciseData extends BaseExercise {
  type: 'multiple-choice';
  options: Array<{id: string, text: string, isCorrect: boolean}>;
}

interface RhymeMatchExerciseData extends BaseExercise {
  type: 'rhyme_match';
  pairs: Array<{id: string, left: string, right: string}>;
}

export type Exercise = 
  | FlashcardExerciseData
  | InfoCardExerciseData
  | FillBlankExerciseData
  | TapWordExerciseData
  | MultipleChoiceExerciseData
  | RhymeMatchExerciseData;

interface ExerciseWrapperProps {
  exercise: Exercise;
  totalExercises: number;
  currentExerciseIndex: number;
  onComplete: (correct: boolean) => void;
}

export default function ExerciseWrapper({
  exercise,
  totalExercises,
  currentExerciseIndex,
  onComplete
}: ExerciseWrapperProps) {
  const [showQuestion, setShowQuestion] = useState(true);
  
  // Progress percentage
  const progress = ((currentExerciseIndex + 1) / totalExercises) * 100;
  
  // Render the appropriate exercise component based on type
  const renderExercise = () => {
    switch (exercise.type) {
      case 'flashcard':
      case 'info_card':
        return (
          <FlashcardExercise
            term={exercise.term}
            definition={exercise.definition}
            onComplete={onComplete}
          />
        );
      case 'fill-blank':
        return (
          <FillBlankExercise
            sentence={exercise.sentence}
            blankIndex={exercise.blankIndex}
            options={exercise.options}
            explanation={exercise.explanation}
            onComplete={onComplete}
          />
        );
      case 'tap-word':
        return (
          <TapWordExercise
            correctSequence={exercise.correctSequence}
            wordOptions={exercise.wordOptions}
            onComplete={onComplete}
          />
        );
      case 'multiple-choice':
        return (
          <MultipleChoiceExercise
            options={exercise.options}
            explanation={exercise.explanation}
            onComplete={onComplete}
          />
        );
      case 'rhyme_match':
        return (
          <RhymeMatchExercise
            pairs={exercise.pairs}
            explanation={exercise.explanation}
            onComplete={onComplete}
          />
        );
      default:
        return <div>Unknown exercise type</div>;
    }
  };
  
  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm font-medium text-gray-500">
            Exercise {currentExerciseIndex + 1} of {totalExercises}
          </div>
          <Badge variant="outline" className="bg-secondary/10 text-secondary font-semibold">
            +{exercise.xpReward} XP
          </Badge>
        </div>
        <div className="xp-progress">
          <div className="xp-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      
      {/* Exercise question */}
      {showQuestion && (
        <Card className="mb-6 border-2 border-secondary/30 p-4">
          <h3 className="text-xl font-semibold mb-2">{exercise.question}</h3>
          {exercise.type === 'tap-word' && (
            <p className="text-sm text-gray-600">
              Create a rhyming flow by tapping the words in the correct order.
            </p>
          )}
        </Card>
      )}
      
      {/* Exercise content */}
      {renderExercise()}
    </div>
  );
}