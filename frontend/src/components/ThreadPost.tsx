import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share, Users, Sparkles } from 'lucide-react';

interface ThreadPostProps {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  content: string;
  image?: string;
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  daoMembers: number;
  hasJoined?: boolean;
}

const ThreadPost: React.FC<ThreadPostProps> = ({
  author,
  content,
  image,
  createdAt,
  likes,
  comments,
  shares,
  daoMembers,
  hasJoined
}) => {
  return (
    <Card className="mb-4 overflow-hidden border-muted/40 glass-card">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <Avatar className="h-10 w-10 border border-primary/20">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback className="bg-primary/20">{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{author.name}</span>
            <span className="text-muted-foreground text-xs">@{author.handle}</span>
          </div>
          <span className="text-xs text-muted-foreground">{createdAt}</span>
        </div>
        <div className="ml-auto">
          <Badge variant="outline" className="gap-1 bg-primary/10 text-primary-foreground text-xs">
            <Users className="h-3 w-3" />
            <span>{daoMembers} members</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm mb-3">{content}</p>
        {image && (
          <div className="relative aspect-video rounded-md overflow-hidden mb-3">
            <img 
              src={image} 
              alt="Post content" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/10 px-2">
            <Heart className="h-4 w-4 mr-1" />
            <span className="text-xs">{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-secondary hover:bg-secondary/10 px-2">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span className="text-xs">{comments}</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent hover:bg-accent/10 px-2">
            <Share className="h-4 w-4 mr-1" />
            <span className="text-xs">{shares}</span>
          </Button>
        </div>
        <Button 
          variant={hasJoined ? "outline" : "default"} 
          size="sm" 
          className={`rounded-full px-3 ${hasJoined ? 'bg-primary/10 hover:bg-primary/20 text-primary' : 'bg-primary hover:bg-primary/90'}`}
        >
          <Sparkles className="h-3 w-3 mr-1" />
          <span className="text-xs">{hasJoined ? 'Joined DAO' : 'Join DAO'}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ThreadPost;