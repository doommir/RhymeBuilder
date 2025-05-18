import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
  src: string;
  title: string;
  loop?: boolean;
  autoPlay?: boolean;
  className?: string;
}

/**
 * A simple audio player component that works with Replit's environment
 */
export default function AudioPlayer({ 
  src, 
  title, 
  loop = true, 
  autoPlay = false,
  className = "" 
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize the audio element
  useEffect(() => {
    // Create a new audio element if one doesn't exist
    if (!audioRef.current) {
      const audio = new Audio();
      audio.loop = loop;
      audioRef.current = audio;
      
      // Set up event listeners
      audio.addEventListener('play', () => setIsPlaying(true));
      audio.addEventListener('pause', () => setIsPlaying(false));
      audio.addEventListener('ended', () => setIsPlaying(false));
      
      audio.addEventListener('canplaythrough', () => {
        setIsLoading(false);
        if (autoPlay) {
          audio.play().catch(err => {
            console.log("Autoplay prevented by browser");
          });
        }
      });
      
      audio.addEventListener('error', (e) => {
        setIsLoading(false);
        setError("Error loading audio");
        console.error("Audio error:", e);
      });
    }
    
    // Update the source if it changes
    if (audioRef.current && src) {
      setIsLoading(true);
      setError(null);
      audioRef.current.src = src;
      audioRef.current.load();
    }
    
    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [src, loop, autoPlay]);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        setError("Couldn't play audio. Try clicking the play button again.");
        console.error("Play error:", err);
      });
    }
  };

  return (
    <div className={`p-4 bg-gray-50 rounded-lg border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-700">{title}</h3>
        {error && <span className="text-red-500 text-xs">{error}</span>}
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="outline"
          size="sm"
          className={`w-10 h-10 p-0 flex items-center justify-center ${
            isPlaying ? 'bg-secondary text-white' : ''
          }`}
          disabled={isLoading}
          onClick={togglePlayback}
        >
          {isLoading ? (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : isPlaying ? (
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </Button>
        
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          {isPlaying && (
            <div className="h-full bg-secondary animate-pulse rounded-full"></div>
          )}
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        {isPlaying ? "Now playing..." : "Click play to start beat"}
      </div>
    </div>
  );
}