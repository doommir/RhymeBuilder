import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface LessonCompleteProps {
  xp: number;
  totalXp: number;
  onContinue: () => void;
}

export default function LessonComplete({ xp, totalXp, onContinue }: LessonCompleteProps) {
  useEffect(() => {
    // Prevent scrolling when modal is shown
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onContinue}></div>
      <div className="bg-white rounded-xl shadow-lg p-6 z-10 max-w-sm w-full mx-4 animate-in fade-in-50 slide-in-from-bottom-10">
        <div className="text-center">
          <div className="w-20 h-20 bg-[hsl(var(--success))] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-check-line text-[hsl(var(--success))] text-3xl"></i>
          </div>
          <h2 className="text-2xl mb-2">Lesson Complete!</h2>
          <p className="text-gray-600 mb-4">You earned <span className="font-semibold text-secondary">+{xp} XP</span></p>
          
          <div className="xp-progress mb-6">
            <div 
              className="xp-bar" 
              style={{ width: `${Math.min(totalXp, 100)}%` }}
            ></div>
          </div>
          
          <Button 
            className="btn-primary w-full py-3 rounded-lg font-poppins font-semibold text-lg"
            onClick={onContinue}
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
