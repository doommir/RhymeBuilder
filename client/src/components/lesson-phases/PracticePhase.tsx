import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRhymePad } from "@/hooks/use-rhymepad";

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
    
    addEntry({
      content: selectedLine,
      tags: ["freestyle", `lesson-${lessonId}`],
      addedFrom: "freestyle",
      lessonId,
      isFavorite: false
    });
    
    toast({
      title: "Added to Flow Vault!",
      description: "Your line has been saved to your collection"
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
        <h2 className="text-2xl font-bold mb-4 gradient-text">Practice Time</h2>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Now it's your turn to practice! We'll play a beat and record your freestyle, 
            transcribing your words in real-time. Then you can save your best lines to your Flow Vault.
          </p>
          
          {/* Beat player controls */}
          <div className="flex justify-center mb-6">
            {!isRecording ? (
              <Button 
                onClick={handleStartRecording}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Start Practice
              </Button>
            ) : (
              <Button 
                onClick={handleStopRecording}
                className="bg-red-500 hover:bg-red-600 text-white"
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
            <h3 className="text-lg font-semibold mb-2">Your Freestyle</h3>
            
            {allLines.length > 0 ? (
              <div className="border rounded-lg p-4 bg-white min-h-[200px]">
                {allLines.map((line, index) => (
                  <div 
                    key={index}
                    onClick={() => handleLineSelect(line)}
                    className={`py-1 px-2 rounded cursor-pointer transition-colors ${
                      selectedLine === line ? 'bg-secondary/20 border-l-4 border-secondary' : 'hover:bg-gray-100'
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-gray-50 min-h-[200px] flex items-center justify-center text-gray-400">
                {isRecording ? "Waiting for your freestyle..." : "Start recording to see your freestyle here"}
              </div>
            )}
          </div>
          
          {/* Save to vault button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSaveToVault}
              disabled={!selectedLine}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
              </svg>
              Save Selected Line to Flow Vault
            </Button>
          </div>
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