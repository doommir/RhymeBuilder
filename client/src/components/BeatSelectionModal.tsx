import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllBeats, Beat } from "@/lib/beats-data";
import { useToast } from "@/hooks/use-toast";

interface BeatSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBeat: (beat: Beat) => void;
}

export default function BeatSelectionModal({ isOpen, onClose, onSelectBeat }: BeatSelectionModalProps) {
  const [selectedBeatId, setSelectedBeatId] = useState<string | null>(null);
  const [previewingBeatId, setPreviewingBeatId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const beats = getAllBeats();
  const { toast } = useToast();

  // Handle previewing a beat
  const handlePreview = (beat: Beat) => {
    // Stop current preview if there is one
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // If clicking on currently previewing beat, stop preview
    if (previewingBeatId === beat.id) {
      setPreviewingBeatId(null);
      return;
    }

    // Start new preview
    setPreviewingBeatId(beat.id);
    try {
      // Create a new audio element
      audioRef.current = new Audio(beat.fileUrl);
      // Set up audio properties
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
      
      // Play the audio
      audioRef.current.play()
        .catch(err => {
          console.error("Error playing audio:", err);
          // Notify user about playback issue
          toast({
            title: "Playback Issue",
            description: "Try interacting with the page first before playing beats.",
            variant: "destructive"
          });
          setPreviewingBeatId(null);
        });
    } catch (err) {
      console.error("Error setting up audio:", err);
      setPreviewingBeatId(null);
    }
  };

  // Stop preview when dialog closes
  const handleDialogClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPreviewingBeatId(null);
    onClose();
  };

  // Select a beat and close dialog
  const handleSelectBeat = () => {
    if (selectedBeatId) {
      const selectedBeat = beats.find(beat => beat.id === selectedBeatId);
      if (selectedBeat) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        onSelectBeat(selectedBeat);
      }
    }
  };

  // Get vibe badge color
  const getVibeBadgeColor = (vibe: string) => {
    switch (vibe) {
      case 'battle':
        return 'bg-red-500';
      case 'laid-back':
        return 'bg-blue-500';
      case 'hype':
        return 'bg-orange-500';
      case 'classic':
        return 'bg-purple-500';
      case 'chill':
        return 'bg-green-500';
      case 'hard':
        return 'bg-slate-800';
      case 'ethereal':
        return 'bg-indigo-400';
      case 'dark':
        return 'bg-gray-900';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text mb-1">
            Choose Your Beat
          </DialogTitle>
          <DialogDescription>
            Preview and select a beat for your freestyle session
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {beats.map(beat => (
            <div 
              key={beat.id}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer ${
                selectedBeatId === beat.id 
                  ? 'border-secondary bg-secondary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedBeatId(beat.id)}
            >
              <div>
                <h3 className="font-bold text-lg">{beat.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`text-white ${getVibeBadgeColor(beat.vibe)}`}>
                    {beat.vibe}
                  </Badge>
                  <span className="text-sm text-gray-500">{beat.bpm} BPM</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreview(beat);
                  }}
                >
                  {previewingBeatId === beat.id ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                      </svg>
                      Stop
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      Preview
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2">
          <Button variant="outline" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button 
            className="bg-secondary text-white" 
            onClick={handleSelectBeat}
            disabled={!selectedBeatId}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Start Freestyle with Beat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}