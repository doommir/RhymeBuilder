import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRhymePad } from "@/hooks/use-rhymepad";

interface VideoPhaseProps {
  videoUrl: string;
  observationChecklist: string[];
  lessonId: string;
  onComplete: () => void;
}

export default function VideoPhase({ 
  videoUrl, 
  observationChecklist, 
  lessonId,
  onComplete 
}: VideoPhaseProps) {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [notes, setNotes] = useState("");
  const [videoWatched, setVideoWatched] = useState(false);
  const { addEntry } = useRhymePad();
  const { toast } = useToast();
  
  const handleCheckboxChange = (index: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  const handleSaveNotes = () => {
    if (!notes.trim()) {
      toast({
        title: "Notes Empty",
        description: "Please add some notes before saving",
        variant: "destructive"
      });
      return;
    }
    
    addEntry({
      content: notes,
      tags: ["notes", `lesson-${lessonId}`],
      addedFrom: "lesson",
      lessonId,
      isFavorite: false
    });
    
    toast({
      title: "Notes Saved to Flow Vault!",
      description: "Your notes have been added to your collection"
    });
    
    setNotes("");
  };
  
  // Handle video completion (in a real app, this would use the YouTube API)
  const simulateVideoComplete = () => {
    setVideoWatched(true);
  };
  
  // Calculate progress based on checklist completion
  const checklistProgress = observationChecklist.length > 0
    ? Object.values(checkedItems).filter(Boolean).length / observationChecklist.length
    : 0;
    
  // Whether to enable the continue button
  const canContinue = videoWatched || checklistProgress > 0.5;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6 border-2 mb-6">
        <h2 className="text-2xl font-bold mb-4 gradient-text">Watch & Learn</h2>
        
        {/* Video embed container */}
        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg mb-6 bg-black">
          <iframe 
            className="absolute top-0 left-0 w-full h-full"
            src={videoUrl}
            title="Lesson Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        
        {/* Mock video controls for testing */}
        {!videoWatched && (
          <div className="mb-6 text-center">
            <Button onClick={simulateVideoComplete} variant="outline">
              Simulate Video Watched
            </Button>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Observation checklist */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Observation Checklist</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Look for these elements while watching:
            </p>
            
            <div className="space-y-3">
              {observationChecklist.map((item, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Checkbox 
                    id={`checkbox-${index}`} 
                    checked={!!checkedItems[index]}
                    onCheckedChange={() => handleCheckboxChange(index)}
                  />
                  <Label
                    htmlFor={`checkbox-${index}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Notes section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Take Notes</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Save key techniques and phrases to your Flow Vault:
            </p>
            
            <Textarea
              placeholder="Write down techniques, flows, and phrases you want to remember..."
              className="min-h-[120px] mb-3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            
            <Button 
              variant="outline" 
              onClick={handleSaveNotes}
              disabled={!notes.trim()}
              className="w-full mb-4"
            >
              Save to Flow Vault
            </Button>
          </div>
        </div>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={onComplete} 
          className="btn-primary"
          disabled={!canContinue}
        >
          Continue to Practice
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