import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { useRhymePad, RhymePadEntry } from "@/hooks/use-rhymepad";
import { Link } from "wouter";

interface DailyPromptProps {
  onDismiss?: () => void;
}

export default function DailyPrompt({ onDismiss }: DailyPromptProps) {
  const { entries, getAllEntries } = useRhymePad();
  const { user, updateXP } = useUser();
  const { toast } = useToast();
  const [dailyPhrase, setDailyPhrase] = useState<RhymePadEntry | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  
  // Check if we already showed a prompt today
  useEffect(() => {
    const showedPromptToday = localStorage.getItem('lastDailyPromptDate');
    const today = new Date().toDateString();
    
    if (showedPromptToday === today) {
      // Already showed a prompt today
      setIsDismissed(true);
    } else {
      // Check if we have entries to show
      const allEntries = getAllEntries();
      if (allEntries.length > 0) {
        // Select a random entry for today's prompt
        const randomEntry = allEntries[Math.floor(Math.random() * allEntries.length)];
        setDailyPhrase(randomEntry);
      }
    }
  }, [getAllEntries]);
  
  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('lastDailyPromptDate', new Date().toDateString());
    if (onDismiss) onDismiss();
  };
  
  const handlePractice = () => {
    // Save that user practiced today (for streak tracking)
    const streakDays = localStorage.getItem('promptStreakDays');
    const newStreakDays = streakDays ? parseInt(streakDays) + 1 : 1;
    localStorage.setItem('promptStreakDays', newStreakDays.toString());
    localStorage.setItem('lastDailyPromptDate', new Date().toDateString());
    
    // Award XP for streak
    if (user) {
      const streakBonus = Math.min(newStreakDays, 5) * 2; // Up to 10 XP for 5-day streak
      updateXP(user.xp + 5 + streakBonus);
      
      toast({
        title: `Daily Practice! +${5 + streakBonus} XP`,
        description: `Base: +5 XP | Streak (${newStreakDays} days): +${streakBonus} XP`,
      });
    }
    
    setIsDismissed(true);
    if (onDismiss) onDismiss();
  };
  
  if (isDismissed || !dailyPhrase) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <Card className="w-full max-w-md p-6 bg-white shadow-lg animate-fadeIn">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold">Daily Flow Practice</h2>
            <p className="text-sm text-muted-foreground">
              Practice this phrase to keep your streak going!
            </p>
          </div>
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            Day {localStorage.getItem('promptStreakDays') ? parseInt(localStorage.getItem('promptStreakDays')!) + 1 : 1}
          </Badge>
        </div>
        
        <div className="my-4 p-4 bg-secondary/10 rounded-lg">
          <p className="text-lg font-medium">{dailyPhrase.content}</p>
          
          {dailyPhrase.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {dailyPhrase.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="bg-secondary/20">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleDismiss}
          >
            Skip Today
          </Button>
          <Link href="/practice">
            <Button
              className="flex-1 btn-primary"
              onClick={handlePractice}
            >
              Practice Now
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}