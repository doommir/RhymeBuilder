import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ReadingPhaseProps {
  readingText: string;
  onComplete: () => void;
}

export default function ReadingPhase({ readingText, onComplete }: ReadingPhaseProps) {
  const [expanded, setExpanded] = useState(false);

  // Split text into paragraphs for better readability
  const paragraphs = readingText.split('. ').map(p => p.trim() + (p.endsWith('.') ? '' : '.'));

  return (
    <Card className="p-6 border-2 mb-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 gradient-text">What You'll Learn</h2>
        
        <div className={`prose prose-lg max-w-none transition-all duration-500 ${
          expanded ? 'max-h-[1000px]' : 'max-h-[150px] overflow-hidden relative'
        }`}>
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="mb-4 text-gray-800">
              {paragraph}
            </p>
          ))}
          
          {!expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
          )}
        </div>
        
        {!expanded && (
          <Button 
            variant="outline" 
            onClick={() => setExpanded(true)} 
            className="mt-2"
          >
            Read More
          </Button>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={onComplete} 
          className="btn-primary"
        >
          Continue to Video
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
    </Card>
  );
}