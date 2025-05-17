import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import LessonOption from "@/components/LessonOption";
import LessonComplete from "@/components/LessonComplete";
import { getLessonData } from "@/lib/lesson-data";

export default function Lesson() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user, updateXP } = useUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  
  const lessonData = getLessonData(id);
  const totalQuestions = lessonData.questions.length;
  
  // If no user is logged in, redirect to login
  useEffect(() => {
    if (!user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      // Last question, show completion modal
      if (user) {
        updateXP(user.xp + 10);
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

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const questionData = lessonData.questions[currentQuestion];
  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;

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
          <div className="font-poppins font-semibold text-sm">
            {currentQuestion + 1}/{totalQuestions}
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-6">
        <div className="xp-progress mb-8">
          <div 
            className="xp-bar" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <div className="question">
          <h2 className="text-2xl mb-6 text-center">{lessonData.title}</h2>
          <p className="text-center text-gray-600 mb-8">{questionData.question}</p>
          
          <div className="space-y-3 mb-8">
            {questionData.options.map((option) => (
              <LessonOption
                key={option.id}
                option={option}
                isSelected={selectedOption === option.id}
                onSelect={() => handleOptionSelect(option.id)}
              />
            ))}
          </div>

          <div className="flex justify-center">
            <Button 
              className="btn-primary px-8 py-3 rounded-lg font-poppins font-semibold text-lg"
              onClick={handleNextQuestion}
              disabled={!selectedOption}
            >
              {currentQuestion < totalQuestions - 1 ? "Continue" : "Finish Lesson"}
            </Button>
          </div>
        </div>
      </div>

      {showCompleteModal && (
        <LessonComplete 
          xp={10} 
          totalXp={user.xp} 
          onContinue={handleContinueToDashboard} 
        />
      )}
    </div>
  );
}
