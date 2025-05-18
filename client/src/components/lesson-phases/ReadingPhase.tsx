import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ReadingPhaseProps {
  readingText: string;
  lessonId?: string;
  onComplete: () => void;
}

// Simple markdown parser for basic formatting
function formatMarkdown(text: string): JSX.Element[] {
  // Split by newlines first to handle paragraphs
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  return lines.map((line, index) => {
    // Check for bold text with ** or __
    let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedLine = formattedLine.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Check for italic text with * or _
    formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
    formattedLine = formattedLine.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Check for bullet points
    if (line.trim().startsWith('- ')) {
      const bulletContent = formattedLine.substring(2);
      return (
        <li key={index} className="ml-5 mb-1" dangerouslySetInnerHTML={{ __html: bulletContent }} />
      );
    }
    
    // Regular paragraph
    return (
      <p key={index} className="mb-4 text-gray-800" dangerouslySetInnerHTML={{ __html: formattedLine }} />
    );
  });
}

export default function ReadingPhase({ readingText, lessonId, onComplete }: ReadingPhaseProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Format the content with our simple markdown parser
  const formattedContent = formatMarkdown(readingText);

  return (
    <Card className="p-6 border-2 mb-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold gradient-text">
            {lessonId === "setup-punchline" ? "Setup & Punchline Fundamentals" : "What You'll Learn"}
          </h2>
          
          {lessonId === "setup-punchline" && (
            <Badge className="bg-blue-600 px-2 py-1">
              Big L Spotlight
            </Badge>
          )}
        </div>
        
        <div className={`prose prose-lg max-w-none transition-all duration-500 ${
          expanded ? 'max-h-[2000px]' : 'max-h-[250px] overflow-hidden relative'
        }`}>
          <div className="lesson-content">
            {formattedContent}
          </div>
          
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            Read More
          </Button>
        )}
        
        {lessonId === "setup-punchline" && expanded && (
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-gray-800">Key Takeaway</h3>
            <p className="text-gray-700">
              The power of a punchline is all about misdirection. Lead the listener down one path with your setup, then surprise them with an unexpected twist in your punchline.
            </p>
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={onComplete} 
          className="btn-primary"
        >
          Continue to Big L Video
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