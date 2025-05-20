import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

interface CountdownAnimationProps {
  isActive: boolean;
  duration: number; // in seconds
  onComplete: () => void;
}

export default function CountdownAnimation({
  isActive,
  duration,
  onComplete
}: CountdownAnimationProps) {
  const [countdown, setCountdown] = useState(3);
  const [progress, setProgress] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showGoMessage, setShowGoMessage] = useState(false);
  
  // Handle countdown animation
  useEffect(() => {
    if (!isActive) {
      setCountdown(3);
      setProgress(0);
      setTimeElapsed(0);
      setShowGoMessage(false);
      return;
    }
    
    // Count down from 3
    const countInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countInterval);
          setShowGoMessage(true);
          
          // After showing "GO!", start the timer
          setTimeout(() => {
            setShowGoMessage(false);
            startTimer();
          }, 800);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      clearInterval(countInterval);
    };
  }, [isActive]);
  
  // Start the main timer
  const startTimer = () => {
    const startTime = Date.now();
    
    const timerInterval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const percent = Math.min((elapsed / duration) * 100, 100);
      
      setTimeElapsed(elapsed);
      setProgress(percent);
      
      if (elapsed >= duration) {
        clearInterval(timerInterval);
        onComplete();
      }
    }, 100); // Update more frequently for smoother animation
    
    return () => clearInterval(timerInterval);
  };
  
  // Format seconds as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (countdown > 0) {
    return (
      <div className="flex flex-col items-center justify-center h-24 bg-secondary/10 rounded-lg border border-secondary/30 animate-pulse">
        <span className="text-4xl font-bold text-secondary">{countdown}</span>
        <span className="text-sm text-secondary mt-1">Get ready to freestyle...</span>
      </div>
    );
  }
  
  if (showGoMessage) {
    return (
      <div className="flex items-center justify-center h-24 bg-primary/10 rounded-lg border border-primary/30 animate-bounce">
        <span className="text-4xl font-bold text-primary">GO!</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">Recording in progress</span>
        <span className="text-sm text-gray-500">
          {formatTime(timeElapsed)} / {formatTime(duration)}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}