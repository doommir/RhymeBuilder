import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRandomWord } from "@/lib/freestyle-words";

// Word categories for themed prompts
const WORD_CATEGORIES = {
  random: "Random Words",
  battle: "Battle Words",
  emotions: "Emotion Words",
  objects: "Object Words"
};

interface BeatSyncedWordPromptProps {
  isActive: boolean;
  bpm: number;
  onWordChange?: (word: string) => void;
}

export default function BeatSyncedWordPrompt({
  isActive,
  bpm,
  onWordChange
}: BeatSyncedWordPromptProps) {
  const [enabled, setEnabled] = useState(true);
  const [currentWord, setCurrentWord] = useState(getRandomWord());
  const [promptStyle, setPromptStyle] = useState<'random' | 'battle' | 'emotions' | 'objects'>('random');
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Calculate the word change interval based on BPM
  // Change words every 2 bars (8 beats)
  const getIntervalFromBpm = (bpm: number) => {
    const secondsPerBeat = 60 / bpm;
    const beatsPerBar = 4;
    const barsToWait = 2; // Change word every 2 bars
    return secondsPerBeat * beatsPerBar * barsToWait * 1000; // Convert to milliseconds
  };
  
  // Set up the interval to change words
  useEffect(() => {
    if (!isActive || !enabled) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    
    // Calculate interval duration based on BPM
    const intervalDuration = getIntervalFromBpm(bpm);
    
    // Set up the interval
    intervalRef.current = setInterval(() => {
      changeWord();
    }, intervalDuration);
    
    // Clean up on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, bpm, enabled, promptStyle]);
  
  // Generate a new word based on the selected prompt style
  const changeWord = () => {
    setIsAnimating(true);
    
    // After a short delay, change the word and trigger fade-in animation
    setTimeout(() => {
      let newWord: string;
      
      // Get a word based on the selected category
      switch (promptStyle) {
        case 'battle':
          newWord = getRandomWord(); // In a real app, filter by category
          break;
        case 'emotions':
          newWord = getRandomWord(); // In a real app, filter by category
          break;
        case 'objects':
          newWord = getRandomWord(); // In a real app, filter by category
          break;
        case 'random':
        default:
          newWord = getRandomWord();
          break;
      }
      
      // Save the word to the used words list
      setUsedWords(prev => [...prev, newWord]);
      
      // Update the current word
      setCurrentWord(newWord);
      
      // Notify parent component
      onWordChange?.(newWord);
      
      // End animation
      setIsAnimating(false);
    }, 300);
  };
  
  return (
    <Card className="p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Word Prompts</h3>
            <p className="text-sm text-gray-500">Words synced to beat ({bpm} BPM)</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={enabled}
              onCheckedChange={setEnabled}
              id="prompt-switch"
            />
            <Label htmlFor="prompt-switch">
              {enabled ? "Enabled" : "Disabled"}
            </Label>
          </div>
        </div>
        
        {enabled && (
          <>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="prompt-style">Prompt Style</Label>
              <Select 
                value={promptStyle} 
                onValueChange={(value: any) => setPromptStyle(value)}
              >
                <SelectTrigger id="prompt-style">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(WORD_CATEGORIES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div 
              className={`h-32 flex items-center justify-center text-center bg-secondary/5 rounded-lg border-2 border-secondary/20 transition-all duration-300 ${
                isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              } ${isActive ? 'animate-pulse' : ''}`}
            >
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-secondary">
                  {currentWord}
                </span>
                <span className="text-xs text-gray-500 mt-2">
                  Use this word in your freestyle
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {usedWords.length} words used
              </span>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={changeWord}
                disabled={!enabled}
              >
                Skip Word
              </Button>
            </div>
            
            {usedWords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {usedWords.slice(-8).map((word, index) => (
                  <Badge key={index} variant="secondary">
                    {word}
                  </Badge>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}