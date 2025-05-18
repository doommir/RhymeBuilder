import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getAllBeats, Beat } from "@/lib/beats-data";

interface BeatsLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBeat: (beat: Beat) => void;
}

// Get unique vibe categories from beats
const getUniqueVibes = (beats: Beat[]): string[] => {
  const vibes = new Set<string>();
  beats.forEach(beat => vibes.add(beat.vibe));
  return Array.from(vibes);
};

export default function BeatsLibrary({ isOpen, onClose, onSelectBeat }: BeatsLibraryProps) {
  const [selectedBeatId, setSelectedBeatId] = useState<string | null>(null);
  const [previewingBeatId, setPreviewingBeatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBeats, setFilteredBeats] = useState<Beat[]>([]);
  const [activeVibe, setActiveVibe] = useState<string>("all");
  
  const allBeats = getAllBeats();
  const vibeCategories = getUniqueVibes(allBeats);
  const { toast } = useToast();

  // Initialize filtered beats on mount
  useEffect(() => {
    setFilteredBeats(allBeats);
  }, [allBeats]);

  // Filter beats based on search query and selected vibe
  useEffect(() => {
    let result = [...allBeats];
    
    // Filter by vibe if not "all"
    if (activeVibe !== "all") {
      result = result.filter(beat => beat.vibe === activeVibe);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(beat => 
        beat.title.toLowerCase().includes(query) || 
        beat.vibe.toLowerCase().includes(query) ||
        beat.bpm.toString().includes(query)
      );
    }
    
    setFilteredBeats(result);
  }, [allBeats, searchQuery, activeVibe]);

  // Handle previewing a beat
  const handlePreview = (beat: Beat) => {
    // We'll try to preview the beat with an audio element
    try {
      // If clicking on currently previewing beat, stop preview
      if (previewingBeatId === beat.id) {
        // Find any existing audio and stop it
        const existingAudio = document.getElementById('beat-preview') as HTMLAudioElement;
        if (existingAudio) {
          existingAudio.pause();
          existingAudio.remove();
        }
        
        setPreviewingBeatId(null);
        return;
      }
      
      // Stop any existing preview
      const existingAudio = document.getElementById('beat-preview') as HTMLAudioElement;
      if (existingAudio) {
        existingAudio.pause();
        existingAudio.remove();
      }
      
      // Create a new audio element for this preview
      const audio = document.createElement('audio');
      audio.id = 'beat-preview';
      audio.src = beat.fileUrl;
      audio.loop = true;
      audio.controls = true; // Show controls so user can play manually if autoplay fails
      audio.style.width = '100%';
      audio.style.marginTop = '10px';
      audio.style.marginBottom = '10px';
      
      // Add a label
      const container = document.createElement('div');
      container.id = 'beat-preview-container';
      const label = document.createElement('div');
      label.textContent = `Preview: ${beat.title} - ${beat.bpm} BPM`;
      label.style.marginBottom = '5px';
      label.style.fontSize = '12px';
      
      // Add to dialog
      container.appendChild(label);
      container.appendChild(audio);
      
      // Add to document in the dialog
      const dialogContent = document.querySelector('[role="dialog"]');
      if (dialogContent) {
        // Look for the dialog description where we can insert our preview
        const dialogDesc = dialogContent.querySelector('div[role="dialog"] > div > div:nth-child(2)');
        if (dialogDesc) {
          dialogDesc.appendChild(container);
        } else {
          // Fallback, just add somewhere in the dialog
          dialogContent.appendChild(container);
        }
      } else {
        // Last resort - add to body
        document.body.appendChild(container);
      }
      
      // Try to play (may be blocked by browser)
      audio.play().catch(err => {
        console.log("Autoplay blocked, user can click play button");
      });
      
      // Mark this beat as being previewed
      setPreviewingBeatId(beat.id);
      
      // Also select this beat
      setSelectedBeatId(beat.id);
    } catch (error) {
      console.error("Error previewing beat:", error);
      
      // Even if preview fails, still select the beat
      setSelectedBeatId(beat.id);
      
      toast({
        title: `${beat.title} selected`,
        description: `${beat.bpm} BPM ${beat.vibe} beat - Click Select to use in freestyle`,
        variant: "default"
      });
    }
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setPreviewingBeatId(null);
    onClose();
  };

  // Select a beat and close dialog
  const handleSelectBeat = () => {
    if (selectedBeatId) {
      const foundBeat = allBeats.find((beat: Beat) => beat.id === selectedBeatId);
      if (foundBeat) {
        onSelectBeat(foundBeat);
      }
    }
  };

  // Get vibe badge color
  const getVibeBadgeColor = (vibe: string) => {
    switch (vibe.toLowerCase()) {
      case 'battle':
        return 'bg-red-500';
      case 'lofi':
      case 'lo-fi':
        return 'bg-blue-500';
      case 'trap':
        return 'bg-orange-500';
      case 'boom-bap':
        return 'bg-purple-600';
      case 'chill':
        return 'bg-green-500';
      case 'melodic':
        return 'bg-pink-500';
      case 'energetic':
        return 'bg-yellow-600';
      case 'dark':
        return 'bg-gray-800';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text mb-1">
            Choose Your Beat
          </DialogTitle>
          <DialogDescription>
            Select a beat for your freestyle session
          </DialogDescription>
        </DialogHeader>

        {/* Selected Beat Preview */}
        <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm font-medium mb-2">
            {selectedBeatId 
              ? `Preview: ${allBeats.find(b => b.id === selectedBeatId)?.title || 'Selected Beat'}`
              : 'Beat Preview'}
          </div>
          
          <audio 
            id="library-preview-player"
            src={selectedBeatId 
              ? allBeats.find(b => b.id === selectedBeatId)?.fileUrl
              : "https://replitusercontent.com/api/v1/9a4fac51-e7a7-4f87-87c0-f84b4da487c3/objects/FlowVaultBeats/Mic%20Assassin%20-%20AI%20Music.mp3"}
            controls 
            className="w-full" 
          />
          
          {selectedBeatId ? (
            <div className="flex justify-between items-center mt-2">
              <Badge className={`text-white ${
                getVibeBadgeColor(allBeats.find(b => b.id === selectedBeatId)?.vibe || 'default')
              }`}>
                {allBeats.find(b => b.id === selectedBeatId)?.vibe || 'default'}
              </Badge>
              <span className="text-xs text-gray-500">
                {allBeats.find(b => b.id === selectedBeatId)?.bpm || '0'} BPM
              </span>
            </div>
          ) : (
            <p className="text-xs text-gray-500 mt-2">
              Select a beat from the list below to preview it
            </p>
          )}
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-4 space-y-4">
          <Input
            placeholder="Search beats by name, vibe, or BPM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          
          <Tabs value={activeVibe} onValueChange={setActiveVibe} className="w-full">
            <TabsList className="w-full overflow-x-auto flex flex-nowrap pb-1">
              <TabsTrigger value="all" className="flex-shrink-0">
                All Beats
              </TabsTrigger>
              {vibeCategories.map(vibe => (
                <TabsTrigger key={vibe} value={vibe} className="flex-shrink-0">
                  {vibe.charAt(0).toUpperCase() + vibe.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Beat List */}
        <div className="grid gap-3 py-2">
          {filteredBeats.length > 0 ? (
            filteredBeats.map(beat => (
              <div 
                key={beat.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                  selectedBeatId === beat.id 
                    ? 'border-secondary bg-secondary/5 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
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
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBeatId(beat.id);
                      handleSelectBeat();
                    }}
                  >
                    Select
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">No beats match your search criteria</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
          <div className="text-sm text-gray-500">
            {filteredBeats.length} beats available
          </div>
          <div className="flex gap-2">
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
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}