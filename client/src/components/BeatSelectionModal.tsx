import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllBeats, Beat, getBeatsByVibe } from "@/lib/beats-data";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BeatSelectionModalProps {
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

export default function BeatSelectionModal({ isOpen, onClose, onSelectBeat }: BeatSelectionModalProps) {
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

  // Handle previewing a beat - simplified approach
  const handlePreview = (beat: Beat) => {
    // Simply highlight the beat - we won't try to play it
    // This avoids issues with browser restrictions
    
    // If clicking on currently selected beat, deselect it
    if (previewingBeatId === beat.id) {
      setPreviewingBeatId(null);
      return;
    }
    
    // Mark as selected
    setPreviewingBeatId(beat.id);
    
    toast({
      title: `${beat.title} selected`,
      description: `${beat.bpm} BPM ${beat.vibe} beat - Click Select to use in freestyle`,
      variant: "default"
    });
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

  // Initialize filtered beats on mount
  useEffect(() => {
    setFilteredBeats(allBeats);
  }, [allBeats]);

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
            Preview and select a beat for your freestyle session
          </DialogDescription>
        </DialogHeader>

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