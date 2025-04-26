import React from 'react';
import { Bell, MessageSquare, Users, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

type NotificationType = 'dao_join' | 'comment' | 'vote' | 'mention' | 'dao_action';

interface NotificationItemProps {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  time: string;
  read: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  type,
  title,
  content,
  time,
  read
}) => {
  const getIcon = () => {
    switch (type) {
      case 'dao_join':
        return <Users className="h-4 w-4" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4" />;
      case 'vote':
        return <Settings className="h-4 w-4" />;
      case 'mention':
        return <User className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className={cn(
      "p-4 hover:bg-muted/50 transition-colors cursor-pointer",
      !read && "bg-muted/20"
    )}>
      <div className="flex gap-4">
        <div className="mt-1">
          <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            {getIcon()}
          </div>
        </div>
        <div className="flex-1">
          <div className="font-medium">{title}</div>
          <p className="text-sm text-muted-foreground">{content}</p>
          <div className="text-xs text-muted-foreground mt-1">{time}</div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
