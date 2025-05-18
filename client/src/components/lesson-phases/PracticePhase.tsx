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
  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingState, setRecordingState] = useState<'idle' | 'preparing' | 'recording' | 'processing'>('idle');
  const [transcription, setTranscription] = useState("");
  const [selectedLine, setSelectedLine] = useState("");
  const [allLines, setAllLines] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Audio states
  const [beatPlaying, setBeatPlaying] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canRecord, setCanRecord] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<{
    startRecording: () => void;
    stopRecording: () => Promise<Blob>;
  } | null>(null);
  
  // Hooks
  const { addEntry } = useRhymePad();
  const { toast } = useToast();
  
  // Initialize audio element and check microphone permissions
  useEffect(() => {
    // Create audio element for the beat
    const audio = new Audio(practiceBeatUrl);
    audio.loop = true;
    audio.volume = 0.8;
    audioRef.current = audio;
    
    // Check if audio file is loaded
    audio.addEventListener('canplaythrough', () => {
      setAudioReady(true);
    });
    
    // Simulate loading progress 
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const newValue = prev + 10;
        if (newValue >= 100) {
          clearInterval(loadingInterval);
          return 100;
        }
        return newValue;
      });
    }, 300);
    
    // Check if browser supports recording
    const checkMicrophonePermission = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setErrorMessage("Your browser doesn't support audio recording.");
          return;
        }
        
        // Set up the audio recording
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        let mediaRecorder: MediaRecorder | null = null;
        let audioChunks: Blob[] = [];
        
        // Create the MediaRecorder
        mediaRecorder = new MediaRecorder(stream);
        
        // Add data handler
        mediaRecorder.addEventListener('dataavailable', (event) => {
          audioChunks.push(event.data);
        });
        
        // Define the recording controls
        const startRecording = () => {
          audioChunks = [];
          mediaRecorder?.start();
        };
        
        const stopRecording = (): Promise<Blob> => {
          return new Promise((resolve) => {
            mediaRecorder?.addEventListener('stop', () => {
              const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
              resolve(audioBlob);
            }, { once: true });
            
            mediaRecorder?.stop();
          });
        };
        
        // Store the controls for later use
        mediaRecorderRef.current = { startRecording, stopRecording };
        
        // Close stream for now (we'll reopen when recording starts)
        stream.getTracks().forEach(track => track.stop());
        
        setCanRecord(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
        setErrorMessage("Couldn't access your microphone. Please check permissions.");
        setCanRecord(false);
      }
    };
    
    checkMicrophonePermission();
    
    return () => {
      clearInterval(loadingInterval);
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
  
  // Start the recording process with countdown
  const startRecordingProcess = async () => {
    if (!canRecord) {
      toast({
        title: "Recording Error",
        description: "Microphone access required. Please check permissions.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Reset states
      setAllLines([]);
      setTranscription("");
      setSelectedLine("");
      setErrorMessage(null);
      setRecordingState('preparing');
      
      // Start countdown
      setCountdown(3);
      
      // Countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            startActualRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error starting recording process:", error);
      setRecordingState('idle');
      toast({
        title: "Recording Error",
        description: "Couldn't start recording. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Start the actual recording after countdown
  const startActualRecording = async () => {
    setIsRecording(true);
    setRecordingState('recording');
    
    try {
      // Start the beat
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
        setBeatPlaying(true);
      }
      
      // Start recording audio
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.startRecording();
        
        // Auto-stop after 60 seconds to prevent very long recordings
        setTimeout(() => {
          if (isRecording) {
            handleStopRecording();
          }
        }, 60000);
      } else {
        throw new Error("MediaRecorder not initialized");
      }
    } catch (error) {
      console.error("Error starting recording:", error);
      handleStopRecording();
      toast({
        title: "Recording Error",
        description: "There was a problem recording your freestyle.",
        variant: "destructive"
      });
    }
  };
  
  // Stop recording and process the audio
  const handleStopRecording = async () => {
    try {
      setIsRecording(false);
      setRecordingState('processing');
      
      // Stop the beat
      if (audioRef.current) {
        audioRef.current.pause();
        setBeatPlaying(false);
      }
      
      // Get the recorded audio
      if (mediaRecorderRef.current) {
        const audioBlob = await mediaRecorderRef.current.stopRecording();
        
        // Convert to base64 for server
        const base64Audio = await blobToBase64(audioBlob);
        
        // Send to server for transcription
        const response = await fetch('/api/transcribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ audio: base64Audio }),
        });
        
        if (!response.ok) {
          throw new Error(`Transcription failed: ${response.statusText}`);
        }
        
        const transcriptionResult = await response.json();
        
        if (transcriptionResult.success) {
          setTranscription(transcriptionResult.transcription || '');
          setAllLines(transcriptionResult.lines || []);
          
          toast({
            title: "Freestyle Transcribed!",
            description: "Your freestyle has been transcribed successfully."
          });
        } else {
          throw new Error(transcriptionResult.message || 'Transcription failed');
        }
      }
    } catch (error) {
      console.error("Error processing recording:", error);
      
      // If transcription fails, use fallback (for testing only)
      if (process.env.NODE_ENV === 'development') {
        useSimulatedTranscription();
      } else {
        toast({
          title: "Transcription Error",
          description: "Couldn't transcribe your freestyle. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setRecordingState('idle');
      setRecordingTime(0);
    }
  };
  
  // Fallback function to simulate transcription (for development/testing)
  const useSimulatedTranscription = () => {
    console.log("Using simulated transcription (development only)");
    
    // Example freestyle lines
    const simulatedLines = [
      "I'm on the mic and I'm ready to flow",
      "Got these rhymes that'll make you wanna know",
      "How I keep it real with every single verse",
      "Flowing smooth like water, never rehearsed",
      "You already know how I bring the heat",
      "Every single time I step on the beat",
      "This is how we do it when we in the booth",
      "Dropping knowledge and the absolute truth"
    ];
    
    // Update state with simulated data
    setTranscription(simulatedLines.join('. '));
    setAllLines(simulatedLines);
    
    toast({
      title: "Freestyle Recorded!",
      description: "Your freestyle has been transcribed below (simulated data)"
    });
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
          
          {/* Error message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              <p className="flex items-center font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Error
              </p>
              <p className="text-sm mt-1">{errorMessage}</p>
            </div>
          )}

          {/* Loading and setup state */}
          {!canRecord && !errorMessage && (
            <div className="mb-6">
              <p className="text-center text-gray-600 mb-2">Preparing audio recording...</p>
              <Progress value={loadingProgress} className="w-full" />
            </div>
          )}
          
          {/* Beat player controls */}
          <div className="flex justify-center mb-6">
            {recordingState === 'idle' ? (
              <Button 
                onClick={startRecordingProcess}
                disabled={!canRecord || !audioReady}
                className="bg-green-500 hover:bg-green-600 text-white"
                size="lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                {lessonId === "setup-punchline" ? "Start Practicing Punchlines" : "Start Practice"}
              </Button>
            ) : recordingState === 'preparing' ? (
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{countdown}</div>
                <p className="text-gray-600">Get ready to freestyle...</p>
              </div>
            ) : recordingState === 'recording' ? (
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
            ) : (
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing your freestyle...</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Recording indicator */}
          {recordingState === 'recording' && (
            <div className="flex items-center justify-center mb-6">
              <div className="animate-pulse bg-red-500 rounded-full h-3 w-3 mr-2"></div>
              <span className="text-red-500 font-medium">Recording: {formatTime(recordingTime)}</span>
              <span className="ml-4 text-sm text-gray-500">(Max 60 seconds)</span>
            </div>
          )}
          
          {/* Transcription display */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">
                {lessonId === "setup-punchline" ? "Your Punchline Practice" : "Your Freestyle"}
              </h3>
              
              {allLines.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  Tap any line to save it to Flow Vault
                </Badge>
              )}
            </div>
            
            {allLines.length > 0 ? (
              <div className="border rounded-lg p-4 bg-white min-h-[200px] overflow-y-auto max-h-[400px]">
                {lessonId === "setup-punchline" ? (
                  // Group lines as setup/punchline pairs for Setup & Punchline lesson
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
                            
                            {/* Bookmark icon for punchlines */}
                            <span className="float-right text-gray-400 hover:text-secondary">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                              </svg>
                            </span>
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
                      className={`py-2 px-3 rounded cursor-pointer transition-colors flex justify-between items-center ${
                        selectedLine === line ? 'bg-secondary/20 border-l-4 border-secondary' : 'hover:bg-gray-100'
                      }`}
                    >
                      <span>{line}</span>
                      <button
                        className="text-gray-400 hover:text-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLineSelect(line);
                          handleSaveToVault();
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            ) : recordingState === 'processing' ? (
              <div className="border rounded-lg p-4 bg-gray-50 min-h-[200px] flex items-center justify-center">
                <div className="text-center">
                  <svg className="animate-spin h-8 w-8 text-secondary mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-500">Transcribing your freestyle...</p>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-6 bg-gray-50 min-h-[200px] flex flex-col items-center justify-center text-center">
                {recordingState === 'recording' ? (
                  <div>
                    <div className="animate-pulse text-red-500 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <p className="text-gray-600">Recording your freestyle...</p>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-500 mb-3">Start recording to see your freestyle transcription here</p>
                    <p className="text-sm text-gray-400 max-w-md">
                      After recording, your freestyle will be transcribed and you can save your best lines to your Flow Vault
                    </p>
                  </>
                )}
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
                {lessonId === "setup-punchline" ? "Save as Punchline to Flow Vault" : "Save Line to Flow Vault"}
              </Button>
            </div>
          )}
          
          {/* Summary statistics (shown after recording) */}
          {allLines.length > 0 && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-2 text-gray-700">Freestyle Stats</h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold text-secondary">{allLines.length}</div>
                  <div className="text-xs text-gray-500">Lines</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-500">{formatTime(recordingTime)}</div>
                  <div className="text-xs text-gray-500">Duration</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-500">
                    {allLines.length > 0 ? Math.round((allLines.length / Math.max(recordingTime, 1)) * 60) : 0}
                  </div>
                  <div className="text-xs text-gray-500">Lines/Min</div>
                </div>
              </div>
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