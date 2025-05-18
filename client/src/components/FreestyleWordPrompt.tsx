import { useState, useEffect } from "react";
import { getRandomWord, getRandomWordByCategory } from "@/lib/freestyle-words";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FreestyleWordPromptProps {
  enabled: boolean;
  onEnableChange?: (enabled: boolean) => void;
  wordUpdateInterval?: number; // in milliseconds
}

export default function FreestyleWordPrompt({ 
  enabled, 
  onEnableChange,
  wordUpdateInterval = 8000 // 8 seconds default
}: FreestyleWordPromptProps) {
  const [currentWord, setCurrentWord] = useState(getRandomWord);
  const [wordHistory, setWordHistory] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Update word on interval when enabled
  useEffect(() => {
    if (!enabled) return;
    
    // Initialize with a word
    if (wordHistory.length === 0) {
      const initialWord = getRandomWord();
      setCurrentWord(initialWord);
      setWordHistory([initialWord]);
    }
    
    const intervalId = setInterval(() => {
      let newWord = getRandomWord();
      
      // Make sure we don't get the same word twice in a row
      while (newWord === currentWord) {
        newWord = getRandomWord();
      }
      
      // Trigger animation for word change
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWord(newWord);
        setWordHistory(prev => [newWord, ...prev].slice(0, 5)); // Keep last 5 words
        setIsAnimating(false);
      }, 300);
      
    }, wordUpdateInterval);
    
    return () => clearInterval(intervalId);
  }, [enabled, currentWord, wordUpdateInterval, wordHistory]);

  // Handle enabling/disabling prompts
  const handleEnableChange = () => {
    if (onEnableChange) {
      onEnableChange(!enabled);
    }
  };

  if (!enabled) {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
        <Label htmlFor="word-prompts" className="text-sm text-gray-700">Word Prompts</Label>
        <Switch id="word-prompts" checked={enabled} onCheckedChange={handleEnableChange} />
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-600">PROMPT</h3>
        <Switch id="word-prompts" checked={enabled} onCheckedChange={handleEnableChange} />
      </div>
      
      <div className="mb-4">
        <div 
          className={`text-center transition-all duration-300 ease-in-out ${
            isAnimating ? 'opacity-0 transform -translate-y-4' : 'opacity-100 transform translate-y-0'
          }`}
        >
          <Badge className="bg-secondary text-white text-xs mb-1">Use this word</Badge>
          <div className="text-4xl font-bold text-gray-800">{currentWord}</div>
        </div>
      </div>
      
      {wordHistory.length > 1 && (
        <div className="border-t border-gray-100 pt-2">
          <div className="text-xs text-gray-500 mb-1">Previous words:</div>
          <div className="flex flex-wrap gap-1">
            {wordHistory.slice(1).map((word, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                {word}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}