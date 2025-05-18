import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { useRhymePad, RhymePadEntry } from "@/hooks/use-rhymepad";

export default function PracticeMode() {
  const { user, updateXP } = useUser();
  const { entries, getAllEntries } = useRhymePad();
  const { toast } = useToast();
  const [freestyleText, setFreestyleText] = useState("");
  const [suggestedEntries, setSuggestedEntries] = useState<RhymePadEntry[]>([]);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [usedVaultPhrases, setUsedVaultPhrases] = useState<Set<string>>(new Set());

  // Get random entries for suggestion
  useEffect(() => {
    const allEntries = getAllEntries();
    if (allEntries.length > 0) {
      // Get up to 3 random entries for suggestions
      const randomEntries = [...allEntries]
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(3, allEntries.length));
      
      setSuggestedEntries(randomEntries);
    }
  }, [getAllEntries, entries.length]);

  // Timer for recording
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    
    if (isRecording) {
      timerId = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRecording]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setFreestyleText("");
    setUsedVaultPhrases(new Set());
    
    toast({
      title: "Recording started",
      description: "Your freestyle session has begun!"
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    
    // Give XP bonus based on length and vault phrases used
    const timeBonus = Math.floor(recordingTime / 30) * 5; // 5 XP per 30 seconds
    const phrasesBonus = usedVaultPhrases.size * 5; // 5 XP per vault phrase used
    const totalBonus = timeBonus + phrasesBonus;
    
    if (totalBonus > 0 && user) {
      updateXP(user.xp + totalBonus);
      
      toast({
        title: `Freestyle Complete! +${totalBonus} XP`,
        description: `Time bonus: +${timeBonus} XP | Vault phrases: +${phrasesBonus} XP`,
      });
    } else {
      toast({
        title: "Freestyle Complete!",
        description: "Your session has been saved",
      });
    }
    
    setRecordingTime(0);
  };

  const handleInsertVaultPhrase = (entry: RhymePadEntry) => {
    if (!isRecording) return;
    
    // Add the phrase to the textarea with proper spacing
    const newText = freestyleText === "" 
      ? entry.content 
      : `${freestyleText} ${entry.content}`;
    
    setFreestyleText(newText);
    
    // Track used phrases for XP bonus
    if (!usedVaultPhrases.has(entry.id)) {
      const newUsedPhrases = new Set(usedVaultPhrases);
      newUsedPhrases.add(entry.id);
      setUsedVaultPhrases(newUsedPhrases);
      
      // Show XP toast
      toast({
        title: "Vault Phrase Used! +5 XP",
        description: `"${entry.content.substring(0, 20)}${entry.content.length > 20 ? '...' : ''}"`,
        variant: "success"
      });
    }
    
    // Close the vault dialog
    setIsVaultOpen(false);
  };

  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 max-w-3xl">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold gradient-text">Freestyle Practice</h1>
        <div className="flex items-center">
          {!isRecording ? (
            <Button 
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={handleStartRecording}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Start Recording
            </Button>
          ) : (
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleStopRecording}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
              Stop Recording
            </Button>
          )}
        </div>
      </header>

      {/* Timer display during recording */}
      {isRecording && (
        <div className="flex justify-center mb-4">
          <div className="bg-black text-white px-4 py-2 rounded-full font-mono text-xl">
            {formatTime(recordingTime)}
          </div>
        </div>
      )}

      {/* Freestyle input area */}
      <Card className="p-4 mb-6 border-2">
        <Textarea
          placeholder={isRecording ? "Start typing your freestyle... or use phrases from your vault" : "Press 'Start Recording' to begin..."}
          className="min-h-[200px] text-lg"
          value={freestyleText}
          onChange={(e) => setFreestyleText(e.target.value)}
          disabled={!isRecording}
        />
        
        {isRecording && (
          <div className="flex justify-between mt-4">
            <Dialog open={isVaultOpen} onOpenChange={setIsVaultOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Insert from Flow Vault
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Choose a phrase from your Flow Vault</DialogTitle>
                </DialogHeader>
                <div className="max-h-[400px] overflow-y-auto">
                  <div className="grid gap-3 my-4">
                    {entries.length === 0 ? (
                      <p className="text-center text-muted-foreground p-4">
                        Your Flow Vault is empty. Add phrases to use them in your freestyle.
                      </p>
                    ) : (
                      entries.map(entry => (
                        <div
                          key={entry.id}
                          className="p-3 border rounded-lg hover:bg-secondary/5 cursor-pointer transition-colors"
                          onClick={() => handleInsertVaultPhrase(entry)}
                        >
                          <p className="font-medium">{entry.content}</p>
                          {entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {entry.tags.map((tag, i) => (
                                <Badge key={i} variant="secondary" className="bg-secondary/10 text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              disabled={!freestyleText.trim()}
              onClick={() => {
                // Add to Flow Vault feature would go here
                toast({
                  title: "Freestyle Saved",
                  description: "Your freestyle has been saved to your Flow Vault",
                });
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
              </svg>
              Save to Flow Vault
            </Button>
          </div>
        )}
      </Card>

      {/* Suggestions from Flow Vault */}
      {isRecording && suggestedEntries.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Suggested Phrases:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {suggestedEntries.map(entry => (
              <Card
                key={entry.id}
                className="p-3 border cursor-pointer hover:shadow-md hover:border-secondary/30 transition-all"
                onClick={() => handleInsertVaultPhrase(entry)}
              >
                <p className="text-md line-clamp-2">{entry.content}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {entry.tags.slice(0, 2).map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {entry.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{entry.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tips and tricks */}
      <Card className="p-4 bg-blue-50 border-blue-200 mb-6">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Freestyle Tips</h2>
        <ul className="list-disc pl-5 text-blue-700 space-y-1">
          <li>Use phrases from your Flow Vault to maintain momentum</li>
          <li>Try to stay on beat (tap your foot to keep time)</li>
          <li>Don't overthink - let the words flow naturally</li>
          <li>Practice using different flow patterns</li>
          <li>Earn bonus XP for longer sessions and using vault phrases</li>
        </ul>
      </Card>
    </div>
  );
}