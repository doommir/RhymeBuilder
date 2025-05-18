import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useRhymePad } from "@/hooks/use-rhymepad";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { blobToBase64 } from "@/lib/audioUtils";
import { apiRequest } from "@/lib/queryClient";

interface PracticePhaseProps {
  practiceBeatUrl: string;
  lessonId: string;
  onComplete: () => void;
}

export default function PracticePhase({ 
  practiceBeatUrl, 
  lessonId,
  onComplete 
}: PracticePhaseProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcription, setTranscription] = useState("");
  const [selectedLine, setSelectedLine] = useState("");
  const [allLines, setAllLines] = useState<string[]>([]);
  const [beatPlaying, setBeatPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { addEntry } = useRhymePad();
  const { toast } = useToast();
  
  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio(practiceBeatUrl);
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [practiceBeatUrl]);
  
  // Handle recording timer
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isRecording) {
      intervalId = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRecording]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Start recording and beat
  const handleStartRecording = () => {
    setIsRecording(true);
    setTranscription("");
    setAllLines([]);
    
    // Start the beat
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
        toast({
          title: "Audio Error",
          description: "Couldn't play the beat. Please try again.",
          variant: "destructive"
        });
      });
      setBeatPlaying(true);
    }
    
    // Simulate transcription for demo purposes
    // In a real app, this would use the OpenAI Whisper API or similar
    simulateTranscription();
  };
  
  // Stop recording and beat
  const handleStopRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
    
    // Stop the beat
    if (audioRef.current) {
      audioRef.current.pause();
      setBeatPlaying(false);
    }
    
    toast({
      title: "Freestyle Recorded!",
      description: "Your freestyle has been transcribed below"
    });
  };
  
  // Simulate transcription for demo
  const simulateTranscription = () => {
    // Example freestyle lines that will appear gradually
    const freestyleLines = [
      "I'm on the mic and I'm ready to flow",
      "Got these rhymes that'll make you wanna know",
      "How I keep it real with every single verse",
      "Flowing smooth like water, never rehearsed",
      "You already know how I bring the heat",
      "Every single time I step on the beat",
      "This is how we do it when we in the booth",
      "Dropping knowledge and the absolute truth"
    ];
    
    let currentIndex = 0;
    
    const addLine = () => {
      if (currentIndex < freestyleLines.length && isRecording) {
        const newLine = freestyleLines[currentIndex];
        setAllLines(prev => [...prev, newLine]);
        setTranscription(prev => prev ? `${prev}\n${newLine}` : newLine);
        currentIndex++;
        
        setTimeout(addLine, Math.random() * 2000 + 1000);
      }
    };
    
    setTimeout(addLine, 1000);
  };
  
  // Save selected line to Flow Vault
  const handleSaveToVault = () => {
    if (!selectedLine) {
      toast({
        title: "No Line Selected",
        description: "Please select a line from your freestyle first",
        variant: "destructive"
      });
      return;
    }
    
    // Default tags
    let tags = ["freestyle", `lesson-${lessonId}`];
    
    // Add specific tags for setup-punchline lesson
    if (lessonId === "setup-punchline") {
      tags = [...tags, "setup-punchline"];
    }
    
    addEntry({
      content: selectedLine,
      tags: tags,
      addedFrom: "freestyle",
      lessonId,
      isFavorite: false
    });
    
    toast({
      title: "Added to Flow Vault!",
      description: lessonId === "setup-punchline" 
        ? "Your punchline has been saved to your collection" 
        : "Your line has been saved to your collection"
    });
    
    setSelectedLine("");
  };
  
  // Handle line selection
  const handleLineSelect = (line: string) => {
    setSelectedLine(line === selectedLine ? "" : line);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6 border-2 mb-6">
        <h2 className="text-2xl font-bold mb-4 gradient-text">
          {lessonId === "setup-punchline" ? "Practice: Setup & Punchline" : "Practice Time"}
        </h2>
        
        <div className="mb-6">
          {lessonId === "setup-punchline" ? (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <h3 className="text-orange-800 font-semibold flex items-center text-base">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
                Challenge: Create Your Own Setup & Punchline
              </h3>
              <p className="text-orange-700 text-sm mt-2">
                Try to create your own setup and punchline while freestyling. Remember:
              </p>
              <ul className="text-sm text-orange-700 mt-1 ml-6 list-disc">
                <li className="mb-1">First bar is the setup (normal, straightforward)</li>
                <li className="mb-1">Second bar is the punchline (surprising twist)</li>
                <li>Keep it simple - just focus on the structure</li>
              </ul>
            </div>
          ) : (
            <p className="text-gray-700 mb-4">
              Now it's your turn to practice! We'll play a beat and record your freestyle, 
              transcribing your words in real-time. Then you can save your best lines to your Flow Vault.
            </p>
          )}
          
          {/* Beat player controls */}
          <div className="flex justify-center mb-6">
            {!isRecording ? (
              <Button 
                onClick={handleStartRecording}
                className="bg-green-500 hover:bg-green-600 text-white"
                size="lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                {lessonId === "setup-punchline" ? "Start Practicing Punchlines" : "Start Practice"}
              </Button>
            ) : (
              <Button 
                onClick={handleStopRecording}
                className="bg-red-500 hover:bg-red-600 text-white"
                size="lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
                Stop Practice
              </Button>
            )}
          </div>
          
          {/* Recording indicator */}
          {isRecording && (
            <div className="flex items-center justify-center mb-6">
              <div className="animate-pulse bg-red-500 rounded-full h-3 w-3 mr-2"></div>
              <span className="text-red-500 font-medium">Recording: {formatTime(recordingTime)}</span>
            </div>
          )}
          
          {/* Transcription display */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">
                {lessonId === "setup-punchline" ? "Your Punchline Practice" : "Your Freestyle"}
              </h3>
              
              {allLines.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  Select any line to save it
                </Badge>
              )}
            </div>
            
            {allLines.length > 0 ? (
              <div className="border rounded-lg p-4 bg-white min-h-[200px]">
                {lessonId === "setup-punchline" ? (
                  // Group lines as setup/punchline pairs
                  Array.from({ length: Math.ceil(allLines.length / 2) }).map((_, pairIndex) => {
                    const setupIndex = pairIndex * 2;
                    const punchlineIndex = setupIndex + 1;
                    const setup = allLines[setupIndex];
                    const punchline = allLines[punchlineIndex];
                    
                    return (
                      <div key={pairIndex} className="mb-4 border-b border-dashed border-gray-200 pb-2 last:border-0">
                        <div 
                          onClick={() => handleLineSelect(setup)}
                          className={`py-1 px-2 rounded cursor-pointer transition-colors ${
                            selectedLine === setup ? 'bg-gray-100 border-l-4 border-gray-400' : 'hover:bg-gray-50'
                          }`}
                        >
                          <Badge variant="outline" className="text-xs mr-2 bg-gray-50">SETUP</Badge>
                          {setup}
                        </div>
                        {punchline && (
                          <div 
                            onClick={() => handleLineSelect(punchline)}
                            className={`py-1 px-2 mt-1 rounded cursor-pointer transition-colors ${
                              selectedLine === punchline ? 'bg-secondary/20 border-l-4 border-secondary' : 'hover:bg-blue-50'
                            }`}
                          >
                            <Badge className="text-xs mr-2 bg-secondary text-white">PUNCH</Badge>
                            {punchline}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  // Regular display for other lesson types
                  allLines.map((line, index) => (
                    <div 
                      key={index}
                      onClick={() => handleLineSelect(line)}
                      className={`py-1 px-2 rounded cursor-pointer transition-colors ${
                        selectedLine === line ? 'bg-secondary/20 border-l-4 border-secondary' : 'hover:bg-gray-100'
                      }`}
                    >
                      {line}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-gray-50 min-h-[200px] flex items-center justify-center text-gray-400">
                {isRecording ? "Waiting for your freestyle..." : "Start recording to see your freestyle here"}
              </div>
            )}
          </div>
          
          {/* Save to vault button */}
          {selectedLine && (
            <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2">
              <Button
                onClick={handleSaveToVault}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                </svg>
                {lessonId === "setup-punchline" ? "Save as Punchline to Flow Vault" : "Save to Flow Vault"}
              </Button>
            </div>
          )}
        </div>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={onComplete} 
          className="btn-primary"
        >
          Continue to Review
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 ml-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}