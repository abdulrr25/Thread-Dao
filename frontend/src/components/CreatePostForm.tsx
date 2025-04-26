import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Image, FileVideo, Globe, Zap } from 'lucide-react';
import AIWritingAssistant from './AIWritingAssistant';

interface CreatePostFormProps {
  userAvatar: string;
  userName: string;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ userAvatar, userName }) => {
  const [content, setContent] = useState('');
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const handleAIToggle = () => {
    setShowAIAssistant(!showAIAssistant);
  };

  const applyAISuggestion = (suggestion: string) => {
    setContent(suggestion);
    setShowAIAssistant(false);
  };

  return (
    <Card className="mb-6 overflow-hidden border-muted/40 glass-card">
      <CardContent className="pt-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 border border-primary/20">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-primary/20">{userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What's happening in your DAO world?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border-none bg-transparent resize-none focus-visible:ring-0 p-0 h-24"
            />
          </div>
        </div>
      </CardContent>
      
      {showAIAssistant && (
        <AIWritingAssistant 
          currentContent={content} 
          onApplySuggestion={applyAISuggestion} 
          onClose={() => setShowAIAssistant(false)}
        />
      )}
      
      <CardFooter className="border-t border-muted/30 flex justify-between pt-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-secondary hover:bg-secondary/10 h-8 w-8">
            <Image className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-secondary hover:bg-secondary/10 h-8 w-8">
            <FileVideo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`hover:bg-primary/10 h-8 w-8 ${showAIAssistant ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            onClick={handleAIToggle}
          >
            <Sparkles className="h-4 w-4" />
          </Button>
          <Badge variant="outline" className="gap-1 bg-muted text-muted-foreground text-xs ml-1">
            <Globe className="h-3 w-3" />
            <span>Public</span>
          </Badge>
        </div>
        <Button 
          variant="default" 
          className="bg-thread-gradient hover:opacity-90 rounded-full"
          disabled={!content.trim()}
        >
          <Zap className="h-4 w-4 mr-1" />
          Post & Create DAO
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreatePostForm;
