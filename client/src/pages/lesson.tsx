import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { getLessonData } from "@/lib/lesson-data";
import ExerciseWrapper, { Exercise } from "@/components/exercises/ExerciseWrapper";
import LessonComplete from "@/components/LessonComplete";



export default function Lesson() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user, completeLesson } = useUser();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  
  const lessonData = getLessonData(id || "intro-rhymes");
  const exercises = lessonData.exercises;
  
  // If no user is logged in, redirect to login
  useEffect(() => {
    if (!user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  // Handler for exercise completion
  const handleExerciseComplete = (correct: boolean) => {
    // Add XP if answer was correct
    if (correct) {
      const xp = exercises[currentExerciseIndex].xpReward;
      setEarnedXp(prev => prev + xp);
      setCorrectAnswers(prev => prev + 1);
    }
    
    // Move to next exercise or show completion
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      // Last exercise completed, show completion modal
      window.sfx.playComplete();
      if (user) {
        completeLesson(lessonData.id, earnedXp);
      }
      setShowCompleteModal(true);
    }
  };

  const handleBackClick = () => {
    setLocation("/dashboard");
  };

  const handleContinueToDashboard = () => {
    setShowCompleteModal(false);
    setLocation("/dashboard");
  };

  // Get random motivational message
  const getRandomMotivationalMessage = () => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);
    return MOTIVATIONAL_MESSAGES[randomIndex];
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen pb-16 bg-background">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            className="flex items-center text-gray-700"
            onClick={handleBackClick}
          >
            <i className="ri-arrow-left-line mr-1 text-xl"></i>
            <span>Back</span>
          </button>
          <div className="flex items-center">
            <Badge variant="outline" className="font-medium bg-secondary/10 text-secondary">
              <i className="ri-flashlight-line mr-1"></i>
              {earnedXp} XP Earned
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-6">
        <h1 className="text-2xl font-bold mb-6 text-center">{lessonData.title}</h1>
        
        {/* Show current exercise */}
        <div className="mb-8">
          {!showCompleteModal && (
            <ExerciseWrapper
              exercise={exercises[currentExerciseIndex] as Exercise}
              totalExercises={exercises.length}
              currentExerciseIndex={currentExerciseIndex}
              onComplete={handleExerciseComplete}
            />
          )}
        </div>
      </div>

      {/* Lesson completion modal */}
      {showCompleteModal && (
        <LessonComplete 
          xp={earnedXp}
          totalXp={user.xp + earnedXp}
          correctAnswers={correctAnswers}
          totalExercises={exercises.length}
          nextLevel={user.level + 1}
          onContinue={handleContinueToDashboard}
        />
      )}
    </div>
  );
}
