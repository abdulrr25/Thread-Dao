import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@/context/WalletContext';
import { api } from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, Users, Coins, ArrowRight,
  PlusCircle, Globe, Shield 
} from 'lucide-react';
import { ThreadPost } from '../components/ThreadPost';
import { TrendingDAO } from '../components/TrendingDAO';
import { ActivityFeed } from '../components/ActivityFeed';
import { DiscoverSuggestions } from '../components/DiscoverSuggestions';
import { Post } from '../types/post';

interface TrendingDAO {
  id: string;
  name: string;
  description: string;
  member_count: number;
  token_symbol: string;
  category: string;
  is_public: boolean;
}

interface RecentActivity {
  id: string;
  type: 'proposal' | 'member' | 'token';
  dao_id: string;
  dao_name: string;
  description: string;
  timestamp: string;
}

interface ApiResponse<T> {
  data: T;
  error?: string;
}

export default function Home() {
  const { address } = useWallet();
  const { toast } = useToast();

  const { data: trendingDaos } = useQuery({
    queryKey: ['trendingDaos'],
    queryFn: () => api.getTrendingDaos()
  });

  const { data: recentActivities } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: () => api.getRecentActivities()
  });

  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: () => api.getPosts()
  });

  if (trendingDaos?.error || recentActivities?.error) {
    toast({
      title: "Error",
      description: trendingDaos?.error || recentActivities?.error,
      variant: "destructive",
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-3">
          <div className="sticky top-8">
            <DiscoverSuggestions />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-6">
          <div className="space-y-6">
            {posts?.map((post: Post) => (
              <ThreadPost
                key={post.id}
                id={post.id}
                content={post.content}
                author={{
                  name: post.author.name,
                  handle: post.author.handle,
                  avatar: post.author.avatar
                }}
                timestamp={post.timestamp}
                likes={0}
                comments={0}
                shares={0}
                daoMembers={0}
              />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-3">
          <div className="sticky top-8 space-y-6">
            <TrendingDAO />
            <ActivityFeed activities={recentActivities || []} />
          </div>
        </div>
      </div>
    </div>
  );
} 