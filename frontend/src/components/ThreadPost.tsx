import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ThreadPostProps {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  daoMembers: number;
}

export default function ThreadPost({
  author,
  content,
  createdAt,
  likes,
  comments,
  shares,
  daoMembers,
}: ThreadPostProps) {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors">
      <div className="flex space-x-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>{author.name[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-semibold">{author.name}</span>
            <span className="text-muted-foreground">@{author.handle}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </span>
          </div>

          <p className="text-sm mb-4 whitespace-pre-wrap">{content}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="gap-2">
                <Heart className="h-4 w-4" />
                <span>{likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>{comments}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                <span>{shares}</span>
              </Button>
            </div>

            <Badge variant="secondary" className="gap-1">
              <Users className="h-3 w-3" />
              <span>{daoMembers} members</span>
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}