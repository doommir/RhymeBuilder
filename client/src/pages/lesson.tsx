import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { getLessonData } from "@/lib/lesson-data";
import { getLessonModule } from "@/lib/new-lesson-data";
import ExerciseWrapper, { Exercise } from "@/components/exercises/ExerciseWrapper";
import LessonComplete from "@/components/LessonComplete";
import LessonCompleteWithSave from "@/components/exercises/LessonCompleteWithSave";
import { useRhymePad, saveToRhymePad } from "@/hooks/use-rhymepad";
import ModernLesson from "@/components/ModernLesson";

export default function Lesson() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user, completeLesson } = useUser();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [useModernFormat, setUseModernFormat] = useState(false);
  
  // Check if we should use the modern lesson format
  useEffect(() => {
    // Use modern format for specific lessons or if URL has a query param
    if (id === "setup-punchline" || 
        id === "filler-phrases" || 
        id === "cadence-flow" || 
        id === "riding-the-beat" || 
        id === "multisyllabic-rhymes") {
      setUseModernFormat(true);
    }
  }, [id]);
  
  // Get lesson data based on format
  const lessonData = getLessonData(id || "intro-rhymes");
  const modernLessonData = useModernFormat ? getLessonModule(id || "setup-punchline") : null;
  const exercises = lessonData.exercises;
  
  // If no user is logged in, check localStorage before redirecting
  useEffect(() => {
    if (!user) {
      // Check if username exists in localStorage
      const storedUsername = localStorage.getItem('username');
      if (!storedUsername) {
        // Only redirect if no username is stored
        setLocation("/");
      }
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
      window.sfx?.playComplete?.();
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

  // Handle completion of modern lesson format
  const handleModernLessonComplete = () => {
    setLocation("/dashboard");
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Render the modern lesson format
  if (useModernFormat && modernLessonData) {
    return (
      <div className="min-h-screen pb-16 bg-background">
        <header className="bg-white shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <button 
              className="flex items-center text-gray-700"
              onClick={handleBackClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span>Back</span>
            </button>
          </div>
        </header>

        <ModernLesson 
          lesson={modernLessonData}
          onComplete={handleModernLessonComplete}
        />
      </div>
    );
  }

  // Render the legacy lesson format
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
      {showCompleteModal && id === "filler-phrases-101" ? (
        <LessonCompleteWithSave 
          xp={earnedXp}
          totalXp={user.xp + earnedXp}
          correctAnswers={correctAnswers}
          totalExercises={exercises.length}
          nextLevel={user.level + 1}
          fillerPhrase="You already know"
          fillerPhraseTags={["filler", "confidence", "versatile"]}
          lessonId={id || "filler-phrases-101"}
          onContinue={handleContinueToDashboard}
        />
      ) : showCompleteModal && (
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
