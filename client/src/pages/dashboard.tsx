import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import BottomNavigation from "@/components/BottomNavigation";

export default function Dashboard() {
  const { user, isLoading } = useUser();
  const [, setLocation] = useLocation();

  // If no user is logged in, redirect to login
  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  const handleStartLesson = (lessonId: string) => {
    setLocation(`/lesson/${lessonId}`);
  };

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen pb-16 bg-background">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl">RhymeTime</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-sm font-poppins font-semibold text-secondary mr-1">
              {user.xp} XP
            </div>
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-lg font-poppins font-semibold text-gray-600">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 mt-6">
        <div className="xp-progress mb-8">
          <div className="xp-bar" style={{ width: `${Math.min(user.xp, 100)}%` }}></div>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                  alt="Microphone for rap learning" 
                  className="w-20 h-20 rounded-full object-cover border-4 border-accent" 
                />
              </div>
              <div>
                <h2 className="text-xl mb-1">
                  Welcome, {user.username}!
                </h2>
                <p className="text-gray-600">Ready to level up your freestyle skills today?</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-xl mb-4">Continue Learning</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="lesson-card overflow-hidden">
            <div className="h-32 bg-secondary">
              <img 
                src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" 
                alt="Music rhythm visualization" 
                className="w-full h-full object-cover" 
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1">Intro to Rhymes</h3>
              <p className="text-sm text-gray-600 mb-3">Learn the basics of rhyming patterns</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">5 minutes</span>
                <Button 
                  className="btn-primary px-4 py-2 rounded-lg text-sm font-poppins font-semibold"
                  onClick={() => handleStartLesson("intro-rhymes")}
                >
                  Start Lesson
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lesson-card overflow-hidden opacity-75">
            <div className="h-32 bg-gray-300">
              <img 
                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" 
                alt="Beat matching game interface" 
                className="w-full h-full object-cover" 
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1">Flow Basics</h3>
              <p className="text-sm text-gray-600 mb-3">Master your rhythm and timing</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">7 minutes</span>
                <Button 
                  className="opacity-50 px-4 py-2 rounded-lg text-sm font-poppins font-semibold"
                  disabled
                >
                  Locked
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl mb-4">Freestyle Challenges</h2>
        
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="mr-4 flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                  alt="Music gamification interface" 
                  className="w-16 h-16 rounded-lg object-cover" 
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-lg">Daily Challenge</h3>
                <p className="text-sm text-gray-600">Complete lessons to unlock challenges</p>
              </div>
              <div>
                <Button 
                  className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold"
                  disabled
                >
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
