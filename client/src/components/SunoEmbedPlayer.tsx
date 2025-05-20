import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import sunoBeats from '@/lib/suno-embed-codes.json';

interface Beat {
  id: string;
  title: string;
  bpm: number;
  vibe: string;
  embedCode: string;
}

interface SunoEmbedPlayerProps {
  initialBeatId?: string;
  onSelectBeat?: (beatId: string, beatInfo: Beat) => void;
}

export default function SunoEmbedPlayer({ 
  initialBeatId = 'beat-1',
  onSelectBeat
}: SunoEmbedPlayerProps) {
  const [selectedBeatId, setSelectedBeatId] = useState(initialBeatId);
  
  // Find the currently selected beat
  const selectedBeat = sunoBeats.find(beat => beat.id === selectedBeatId) || sunoBeats[0];
  
  // Group beats by vibe for filtering
  const vibeGroups = sunoBeats.reduce((groups, beat) => {
    if (!groups[beat.vibe]) {
      groups[beat.vibe] = [];
    }
    groups[beat.vibe].push(beat);
    return groups;
  }, {} as Record<string, typeof sunoBeats>);
  
  // Handle beat selection
  const handleSelectBeat = (beatId: string) => {
    setSelectedBeatId(beatId);
    const beatInfo = sunoBeats.find(beat => beat.id === beatId);
    if (beatInfo && onSelectBeat) {
      onSelectBeat(beatId, beatInfo as Beat);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Current beat player */}
      <div className="p-4 border rounded-lg bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-medium text-lg">{selectedBeat.title}</h3>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary">{selectedBeat.vibe}</Badge>
              <span className="text-sm text-gray-500">{selectedBeat.bpm} BPM</span>
            </div>
          </div>
        </div>
        
        <div className="beat-player-container">
          <iframe 
            src={selectedBeat.embedCode} 
            width="100%" 
            height="240" 
            style={{ border: "none", borderRadius: "8px" }}
          >
            <a href={selectedBeat.embedCode.replace('/embed/', '/song/')}>Listen on Suno</a>
          </iframe>
        </div>
      </div>
      
      {/* Beat selection list */}
      <div>
        <h3 className="font-medium mb-3">Beat Library</h3>
        <div className="grid gap-3">
          {Object.entries(vibeGroups).map(([vibe, beats]) => (
            <div key={vibe} className="space-y-2">
              <h4 className="text-sm font-medium capitalize">{vibe} Beats</h4>
              <div className="grid gap-2">
                {beats.map(beat => (
                  <div 
                    key={beat.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      beat.id === selectedBeatId 
                        ? 'bg-secondary/10 border-secondary' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => handleSelectBeat(beat.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">{beat.title}</h5>
                        <span className="text-xs text-gray-500">{beat.bpm} BPM</span>
                      </div>
                      <Button
                        variant={beat.id === selectedBeatId ? "secondary" : "outline"}
                        size="sm"
                      >
                        {beat.id === selectedBeatId ? 'Selected' : 'Select'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}