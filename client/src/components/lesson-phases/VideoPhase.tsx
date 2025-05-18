import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRhymePad } from "@/hooks/use-rhymepad";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    
    // Add appropriate tags based on lesson
    let tags = ["notes", `lesson-${lessonId}`];
    
    // Add specific tags for setup-punchline lesson
    if (lessonId === "setup-punchline") {
      tags = [...tags, "setup-punchline"];
    }
    
    addEntry({
      content: notes,
      tags: tags,
      addedFrom: "lesson",
      lessonId,
      isFavorite: false
    });
    
    toast({
      title: "Saved to Flow Vault!",
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
        <h2 className="text-2xl font-bold mb-4 gradient-text">
          {lessonId === "setup-punchline" ? "Watch & Learn: Big L Masterclass" : "Watch & Learn"}
        </h2>
        
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
              I've Watched This Video
            </Button>
          </div>
        )}
        
        <Tabs defaultValue="observe" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="observe">Observation Tasks</TabsTrigger>
            <TabsTrigger value="notes">Take Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="observe" className="mt-4">
            <div className="bg-muted/20 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-semibold mb-2">
                {lessonId === "setup-punchline" 
                  ? "Watch How Big L Structures His Punchlines" 
                  : "Observation Checklist"}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4">
                Check off each item as you notice it in the video:
              </p>
              
              <div className="space-y-3">
                {observationChecklist.map((item, index) => (
                  <div key={index} className="flex items-start space-x-2 bg-white p-3 rounded-md border">
                    <Checkbox 
                      id={`checkbox-${index}`} 
                      checked={!!checkedItems[index]}
                      onCheckedChange={() => handleCheckboxChange(index)}
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor={`checkbox-${index}`}
                      className="text-sm font-medium leading-tight"
                    >
                      {item}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {lessonId === "setup-punchline" && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Pro Tip
                </h4>
                <p className="text-sm text-blue-700 mb-0">
                  Notice how Big L often delivers his punchlines with the same calm demeanor as his setups, letting the words create the impact rather than changing his delivery.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="notes" className="mt-4">
            <div className="bg-muted/20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                {lessonId === "setup-punchline" 
                  ? "Write Down Punches & Techniques" 
                  : "Take Notes"}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4">
                {lessonId === "setup-punchline"
                  ? "Write down punches you liked or setups you noticed..."
                  : "Save key techniques and phrases to your Flow Vault:"}
              </p>
              
              <Textarea
                placeholder={lessonId === "setup-punchline" 
                  ? "Example: 'Ask Beavis, I get nothing but-head' uses misdirection until the last syllable..."
                  : "Write down techniques, flows, and phrases you want to remember..."}
                className="min-h-[150px] mb-3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              
              <Button 
                variant="outline" 
                onClick={handleSaveNotes}
                disabled={!notes.trim()}
                className="w-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                </svg>
                Save to Flow Vault
              </Button>
            </div>
          </TabsContent>
        </Tabs>
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