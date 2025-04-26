import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Globe, Clock, Wallet, Users, ExternalLink } from 'lucide-react';
import { DaoData } from '@/types/dao';

interface DaoHeaderProps {
  daoData: DaoData;
  joined: boolean;
  onJoinClick: () => void;
}

const DaoHeader: React.FC<DaoHeaderProps> = ({ daoData, joined, onJoinClick }) => {
  return (
    <div className="relative">
      <div className="h-48 md:h-64 w-full bg-cover bg-center bg-thread-gradient">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      <div className="container max-w-6xl relative -mt-16 md:-mt-20 px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-thread-gradient flex items-center justify-center border-4 border-background relative z-10">
            <Sparkles className="h-12 w-12 text-white" />
          </div>
          
          <div className="flex-1 pt-4 md:pt-16">
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold">{daoData.name}</h1>
                  <Badge>{daoData.type}</Badge>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>Created {daoData.created}</span>
                  <span>•</span>
                  <span>{daoData.members} members</span>
                </div>
              </div>
              
              <Button 
                variant={joined ? "outline" : "default"}
                className={joined ? "border-primary text-primary" : "bg-thread-gradient hover:opacity-90"}
                onClick={onJoinClick}
              >
                {joined ? "Joined" : "Join DAO"}
              </Button>
            </div>
            
            <p className="mt-3 text-sm md:text-base">{daoData.description}</p>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{daoData.members} members</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span>{daoData.postsCount} posts</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Wallet className="h-4 w-4" />
                <span>{daoData.treasury} treasury</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Created {daoData.created}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {Object.entries(daoData.links).map(([key, value]) => (
                <a
                  key={key}
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaoHeader;
