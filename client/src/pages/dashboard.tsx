import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { useRhymePad } from "@/hooks/use-rhymepad";
import BottomNavigation from "@/components/BottomNavigation";
import DailyPrompt from "@/components/DailyPrompt";
import { getAllLessons, isLessonUnlocked } from "@/lib/lesson-data";
import { getAllLessonModules, isLessonModuleUnlocked } from "@/lib/new-lesson-data";

// Define level-up thresholds
const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500];

export default function Dashboard() {
  const { user, isLoading } = useUser();
  const { entries } = useRhymePad();
  const [, setLocation] = useLocation();
  const [showDailyPrompt, setShowDailyPrompt] = useState(entries.length > 0);

  // If no user is logged in, check localStorage before redirecting
  useEffect(() => {
    if (!isLoading && !user) {
      // Check if username exists in localStorage
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        // If username exists but user state is empty, refresh the page to load from localStorage
        window.location.reload();
      } else {
        // No username stored, redirect to login
        setLocation("/");
      }
    }
  }, [user, isLoading, setLocation]);

  const handleStartLesson = (lessonId: string) => {
    setLocation(`/lesson/${lessonId}`);
  };

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Calculate XP progress to next level
  const currentLevel = user.level || 1;
  const nextLevelThreshold = currentLevel < 5 ? LEVEL_THRESHOLDS[currentLevel] : LEVEL_THRESHOLDS[4] + 100;
  const prevLevelThreshold = LEVEL_THRESHOLDS[currentLevel - 1];
  const levelProgress = ((user.xp - prevLevelThreshold) / (nextLevelThreshold - prevLevelThreshold)) * 100;

  const allLessons = getAllLessons();
  const allLessonModules = getAllLessonModules();

  return (
    <div className="min-h-screen pb-16 bg-background">
      {/* Show daily prompt if user has vault entries */}
      {showDailyPrompt && <DailyPrompt onDismiss={() => setShowDailyPrompt(false)} />}
      
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">FlowTrainer</h1>
          </div>
          <div className="flex items-center">
            <div className="mr-3 text-center">
              <div className="flex items-center justify-center rounded-full bg-secondary w-8 h-8 mb-1 text-white font-bold text-sm mx-auto">
                {currentLevel}
              </div>
              <div className="text-xs text-gray-500">Level</div>
            </div>
            <div className="mr-3 text-center">
              <div className="flex items-center justify-center rounded-full bg-primary w-8 h-8 mb-1 text-white font-bold text-sm mx-auto">
                <i className="ri-fire-fill"></i>
              </div>
              <div className="text-xs text-gray-500">{user.streak} day{user.streak !== 1 ? 's' : ''}</div>
            </div>
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <span className="text-lg font-poppins font-semibold text-gray-800">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 mt-4">
        {/* XP Bar with label */}
        <div className="flex items-center mb-5">
          <div className="mr-2">
            <div className="text-sm font-medium text-gray-700">{user.xp} XP</div>
          </div>
          <div className="xp-progress flex-grow">
            <div 
              className="xp-bar" 
              style={{ width: `${levelProgress}%` }}
            ></div>
          </div>
          <div className="ml-2">
            <div className="text-sm font-medium text-gray-700">{nextLevelThreshold} XP</div>
          </div>
        </div>

        {/* User welcome card with stats */}
        <Card className="mb-8 border-2 border-secondary/20 shadow-lg bg-white">
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                    alt="Microphone for rap learning" 
                    className="w-20 h-20 rounded-full object-cover border-4 border-accent" 
                  />
                  <div className="absolute -bottom-2 -right-2 bg-secondary text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold">
                    {currentLevel}
                  </div>
                </div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold mb-1">
                  Welcome, {user.username}!
                </h2>
                <p className="text-gray-600 mb-2">You're on a {user.streak} day streak! 🔥</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs px-3 py-1">
                    Level {currentLevel} MC
                  </Badge>
                  <Badge variant="outline" className="text-xs px-3 py-1">
                    {user.completedLessons.length} Lessons
                  </Badge>
                  <Badge variant="outline" className="text-xs px-3 py-1">
                    {user.xp} XP Total
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-5 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          New Immersive Lessons
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {allLessonModules.map(module => {
            const isUnlocked = isLessonModuleUnlocked(
              module.id, 
              user.xp, 
              user.completedLessons
            );
            const isCompleted = user.completedLessons.includes(module.id);
            
            // Image mapping for lesson modules
            const getModuleImage = (moduleId: string) => {
              switch(moduleId) {
                case "setup-punchline":
                  return "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200";
                case "filler-phrases":
                  return "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200";
                case "cadence-flow":
                  return "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200";
                case "riding-the-beat":
                  return "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200";
                case "multisyllabic-rhymes":
                  return "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200";
                default:
                  return "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200";
              }
            };
            
            return (
              <Card 
                key={module.id}
                className={`lesson-card overflow-hidden border-2 ${
                  isCompleted 
                    ? 'border-green-400/50 shadow-green-100' 
                    : isUnlocked 
                      ? 'border-blue-400/30 shadow-lg hover:shadow-blue-50 transition-shadow' 
                      : 'border-gray-200 opacity-75'
                }`}
              >
                <div className="h-32 bg-secondary relative">
                  <img 
                    src={getModuleImage(module.id)}
                    alt={module.title} 
                    className={`w-full h-full object-cover ${!isUnlocked ? 'filter grayscale' : ''}`}
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-blue-600 text-white font-bold">
                      Level {module.level}
                    </Badge>
                  </div>
                  {isCompleted && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-green-500 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Completed
                      </Badge>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-purple-600 text-white font-bold">
                      NEW FORMAT
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center mb-1">
                    <h3 className="font-bold text-lg">{module.title}</h3>
                    {isCompleted && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L13.586 9H10a1 1 0 110-2h3.586l-2.293-2.293A1 1 0 0112 2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      <span>{module.totalXp} XP</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>4 phases</span>
                    </div>
                    <Button 
                      className={`${
                        isUnlocked 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-gray-200 text-gray-500'
                      } px-4 py-2 rounded-lg text-sm font-poppins font-semibold transition-colors`}
                      onClick={() => isUnlocked && handleStartLesson(module.id)}
                      disabled={!isUnlocked}
                    >
                      {isCompleted ? 'Practice Again' : isUnlocked ? 'Start' : 'Locked'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <h2 className="text-2xl font-bold mb-5 flex items-center">
          <i className="ri-book-open-line mr-2 text-primary"></i>
          Classic Lessons
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {allLessons.map(lesson => {
            const isUnlocked = isLessonUnlocked(
              lesson.id, 
              user.xp, 
              user.completedLessons
            );
            const isCompleted = user.completedLessons.includes(lesson.id);
            
            return (
              <Card 
                key={lesson.id}
                className={`lesson-card overflow-hidden border-2 ${
                  isCompleted 
                    ? 'border-green-400/50 shadow-green-100' 
                    : isUnlocked 
                      ? 'border-secondary/30 shadow-md' 
                      : 'border-gray-200 opacity-75'
                }`}
              >
                <div className="h-32 bg-secondary relative">
                  <img 
                    src={
                      lesson.id === "intro-rhymes" 
                        ? "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
                        : "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
                    }
                    alt={lesson.title} 
                    className={`w-full h-full object-cover ${!isUnlocked ? 'filter grayscale' : ''}`}
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-secondary text-white font-bold">
                      Level {lesson.level}
                    </Badge>
                  </div>
                  {isCompleted && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-green-500 text-white">
                        <i className="ri-check-line mr-1"></i> Completed
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center mb-1">
                    <h3 className="font-bold text-lg">{lesson.title}</h3>
                    {isCompleted && (
                      <i className="ri-trophy-fill text-yellow-500 ml-2"></i>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <i className="ri-flashlight-line mr-1"></i>
                      <span>{lesson.totalXp} XP</span>
                      <i className="ri-time-line ml-3 mr-1"></i>
                      <span>{lesson.exercises.length} exercises</span>
                    </div>
                    <Button 
                      className={`${
                        isUnlocked 
                          ? 'btn-primary' 
                          : 'bg-gray-200 text-gray-500'
                      } px-4 py-2 rounded-lg text-sm font-poppins font-semibold`}
                      onClick={() => isUnlocked && handleStartLesson(lesson.id)}
                      disabled={!isUnlocked}
                    >
                      {isCompleted ? 'Practice Again' : isUnlocked ? 'Start' : 'Locked'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <h2 className="text-2xl font-bold mb-5 flex items-center">
          <i className="ri-sword-line mr-2 text-primary"></i>
          Freestyle Challenges
        </h2>
        
        <Card className="mb-8 border-2 border-gray-200">
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="mr-4 flex-shrink-0">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <i className="ri-mic-line text-3xl text-gray-400"></i>
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-lg">Daily Freestyle</h3>
                <p className="text-sm text-gray-600">Complete more lessons to unlock</p>
              </div>
              <div>
                <Button 
                  className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold"
                  disabled
                >
                  <i className="ri-lock-line mr-1"></i>
                  Locked
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation active="home" />
    </div>
  );
}
