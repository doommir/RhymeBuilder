import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface SimpleBeatPlayerProps {
  beatUrl: string;
  title: string;
  onPlayError?: (error: any) => void;
  onPlayStart?: () => void;
}

export default function SimpleBeatPlayer({ 
  beatUrl, 
  title,
  onPlayError,
  onPlayStart
}: SimpleBeatPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  // Initialize audio element
  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioElement) {
      const audio = new Audio(beatUrl);
      audio.volume = 0.8;
      
      // Event listeners
      audio.addEventListener('play', () => setIsPlaying(true));
      audio.addEventListener('pause', () => setIsPlaying(false));
      audio.addEventListener('ended', () => setIsPlaying(false));
      
      setAudioElement(audio);
    } else {
      // Update source if URL changes
      audioElement.src = beatUrl;
      audioElement.load();
    }
    
    // Cleanup
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [beatUrl]);
  
  // Handle play/pause
  const togglePlay = () => {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play()
        .then(() => {
          console.log('Beat playing successfully');
          onPlayStart?.();
        })
        .catch(err => {
          console.error('Error playing beat:', err);
          onPlayError?.(err);
        });
    }
  };
  
  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        
        <Button
          variant={isPlaying ? "secondary" : "outline"}
          size="sm"
          onClick={togglePlay}
          className="flex items-center gap-1"
        >
          {isPlaying ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Play
            </>
          )}
        </Button>
      </div>
      
      <div className="flex items-center gap-2 mt-1">
        <div className={`h-1.5 bg-gray-200 rounded-full w-full ${isPlaying ? "relative overflow-hidden" : ""}`}>
          {isPlaying && (
            <div className="absolute top-0 left-0 h-full bg-secondary animate-pulse w-full"></div>
          )}
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-1">
        {isPlaying ? "Now playing..." : "Click play to listen to this beat"}
      </p>
    </div>
  );
}