import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

interface BasicAudioPlayerProps {
  title: string;
  audioUrl: string;
}

export default function BasicAudioPlayer({ title, audioUrl }: BasicAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Use React refs to interact with the audio element
  const audioRef = React.useRef<HTMLAudioElement>(null);
  
  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error("Failed to play audio:", error);
        });
    }
  };
  
  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">{title}</h3>
        
        <Button
          variant={isPlaying ? "secondary" : "outline"}
          size="sm"
          onClick={togglePlayback}
        >
          {isPlaying ? (
            <>
              <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Play
            </>
          )}
        </Button>
      </div>
      
      {/* Hidden audio element for browser compatibility */}
      <audio 
        ref={audioRef}
        src={audioUrl}
        preload="auto"
        onEnded={() => setIsPlaying(false)}
        className="w-full"
        controls
      />
    </div>
  );
}