import { useState } from "react";
import { LessonModule } from "@/lib/new-lesson-data";
import ReadingPhase from "@/components/lesson-phases/ReadingPhase";
import VideoPhase from "@/components/lesson-phases/VideoPhase";
import PracticePhase from "@/components/lesson-phases/PracticePhase";
import RecallPhase from "@/components/lesson-phases/RecallPhase";
import CompletionPhase from "@/components/lesson-phases/CompletionPhase";

interface ModernLessonProps {
  lesson: LessonModule;
  onComplete: () => void;
}

export default function ModernLesson({ lesson, onComplete }: ModernLessonProps) {
  // Track the current phase of the lesson
  const [currentPhase, setCurrentPhase] = useState<'reading' | 'video' | 'practice' | 'recall' | 'complete'>('reading');
  
  // Track earned XP and correct answers for the completion phase
  const [earnedXp, setEarnedXp] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  
  // Progress through phases
  const handleReadingComplete = () => {
    setCurrentPhase('video');
  };
  
  const handleVideoComplete = () => {
    setCurrentPhase('practice');
  };
  
  const handlePracticeComplete = () => {
    setCurrentPhase('recall');
  };
  
  const handleRecallComplete = (xp: number, correct: number) => {
    setEarnedXp(xp);
    setCorrectAnswers(correct);
    setCurrentPhase('complete');
  };
  
  // Render the current phase
  const renderPhase = () => {
    switch (currentPhase) {
      case 'reading':
        return (
          <ReadingPhase 
            readingText={lesson.readingText}
            lessonId={lesson.id}
            onComplete={handleReadingComplete} 
          />
        );
      case 'video':
        return (
          <VideoPhase 
            videoUrl={lesson.videoUrl}
            observationChecklist={lesson.observationChecklist}
            lessonId={lesson.id}
            onComplete={handleVideoComplete}
          />
        );
      case 'practice':
        return (
          <PracticePhase 
            practiceBeatUrl={lesson.practiceBeatUrl}
            lessonId={lesson.id}
            onComplete={handlePracticeComplete}
          />
        );
      case 'recall':
        return (
          <RecallPhase 
            exercises={lesson.recallExercises}
            onComplete={handleRecallComplete}
          />
        );
      case 'complete':
        return (
          <CompletionPhase 
            lessonId={lesson.id}
            earnedXp={earnedXp}
            correctAnswers={correctAnswers}
            totalExercises={lesson.recallExercises.length}
            onComplete={onComplete}
          />
        );
      default:
        return null;
    }
  };
  
  // Determine progress percentage through lesson
  const getProgressPercentage = () => {
    const phases = ['reading', 'video', 'practice', 'recall', 'complete'];
    const currentIndex = phases.indexOf(currentPhase);
    return ((currentIndex + 1) / phases.length) * 100;
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Phase indicator */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-500">
            {currentPhase === 'reading' && 'Reading Phase'}
            {currentPhase === 'video' && 'Video Observation Phase'}
            {currentPhase === 'practice' && 'Practice Phase'}
            {currentPhase === 'recall' && 'Knowledge Check Phase'}
            {currentPhase === 'complete' && 'Lesson Complete!'}
          </div>
          <div className="text-sm text-gray-500">
            {Math.round(getProgressPercentage())}% Complete
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-secondary h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>
      
      {/* Current phase content */}
      {renderPhase()}
    </div>
  );
}