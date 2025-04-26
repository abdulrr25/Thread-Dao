import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, X } from 'lucide-react';

interface AIWritingAssistantProps {
  currentContent: string;
  onApplySuggestion: (suggestion: string) => void;
  onClose: () => void;
}

const AIWritingAssistant: React.FC<AIWritingAssistantProps> = ({
  currentContent,
  onApplySuggestion,
  onClose
}) => {
  // In a real app, this would call an AI API with the current content
  // For demo purposes, we'll just provide fixed suggestions
  
  const suggestions = [
    "I'm launching a new DeFi protocol that allows fractional ownership of NFTs with integrated governance. Looking for early testers and feedback!",
    "Just completed our DAO's first community vote on treasury allocation. 65% voted for funding developer grants. Excited to see what gets built!",
    "Working on a decentralized content platform where creators earn directly from their audience. No middlemen, full ownership, built on Solana.",
  ];
  
  // Only show improvement if there's actual content
  const improvements = currentContent.length > 10
    ? [`${currentContent} (Improved with better clarity and engagement)`]
    : [];
  
  const allSuggestions = [...improvements, ...suggestions];

  return (
    <Card className="mb-3 mx-4 bg-muted border border-primary/20 relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-6 w-6 text-muted-foreground hover:text-foreground"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Writing Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="py-0 px-4 pb-3">
        <div className="space-y-2">
          {allSuggestions.map((suggestion, index) => (
            <div 
              key={index}
              className="p-2 rounded-md bg-card/50 hover:bg-card cursor-pointer text-sm"
              onClick={() => onApplySuggestion(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIWritingAssistant;
