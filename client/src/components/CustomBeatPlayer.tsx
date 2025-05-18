import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Beat } from "@/lib/beats-data";

interface CustomBeatPlayerProps {
  beat: Beat;
  className?: string;
}

export default function CustomBeatPlayer({ beat, className = "" }: CustomBeatPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Create audio element when component mounts
    const audio = new Audio();
    audioRef.current = audio;
    
    // Set up event listeners
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setProgress(0);
    });
    
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    });
    
    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);
  
  // Update source when beat changes
  useEffect(() => {
    if (audioRef.current) {
      // First pause if playing
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      
      // Then set new source
      audioRef.current.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
      audioRef.current.load();
    }
  }, [beat]);
  
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error("Error playing audio:", err);
      });
    }
  };
  
  return (
    <div className={`p-4 bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-medium">{beat.title}</h3>
          <div className="flex gap-2 items-center mt-1">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{beat.bpm} BPM</span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{beat.vibe}</span>
          </div>
        </div>
        
        <Button 
          variant={isPlaying ? "default" : "outline"}
          size="sm"
          onClick={handlePlayPause}
          className="h-10 w-10 rounded-full p-0 flex items-center justify-center"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </Button>
      </div>
      
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-3">
        <div 
          className="h-full bg-secondary transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        Testing beat for freestyle practice. Selected beat will be used during recording.
      </p>
    </div>
  );
}