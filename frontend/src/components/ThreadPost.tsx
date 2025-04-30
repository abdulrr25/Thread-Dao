import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Heart, MessageCircle, Share2, Users } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { api } from '../services/api';

interface Author {
  name: string;
  handle: string;
  avatar: string;
}

interface ThreadPostProps {
  id: string;
  content: string;
  author: Author;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  daoMembers: number;
}

export function ThreadPost({
  id,
  content,
  author,
  timestamp,
  likes: initialLikes,
  comments: initialComments,
  shares: initialShares,
  daoMembers
}: ThreadPostProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [shares, setShares] = useState(initialShares);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  const handleLike = async () => {
    try {
      if (isLiked) {
        await api.unlikePost(id);
        setLikes((prev) => prev - 1);
      } else {
        await api.likePost(id);
        setLikes((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update like status',
        variant: 'destructive'
      });
    }
  };

  const handleShare = async () => {
    try {
      await api.sharePost(id);
      setShares((prev) => prev + 1);
      toast({
        title: 'Success',
        description: 'Post shared successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to share post',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>{author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{author.name}</span>
            <span className="text-muted-foreground">@{author.handle}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              {new Date(timestamp).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm mb-4">{content}</p>
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={handleLike}
            >
              <Heart
                className={`h-4 w-4 ${isLiked ? 'fill-current text-red-500' : ''}`}
              />
              <span>{likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>{comments}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              <span>{shares}</span>
            </Button>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{daoMembers} members</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}