import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Loading } from '@/components/ui/loading';
import ThreadPost from '@/components/ThreadPost';
import TrendingDAO from '@/components/TrendingDAO';
import DiscoverSuggestions from '@/components/DiscoverSuggestions';
import { Post } from '@/types/dao';
import { daoService } from '@/services/supabase';

const Home: React.FC = () => {
  const { data: posts, isLoading: isLoadingPosts } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: () => api.getDaoPosts(''),
  });

  const { data: daos, isLoading: isLoadingDaos } = useQuery({
    queryKey: ['daos'],
    queryFn: () => daoService.getDAOs(),
  });

  if (isLoadingPosts || isLoadingDaos) {
    return <Loading text="Loading content..." />;
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h2 className="mb-6 text-2xl font-bold">Recent Posts</h2>
        <div className="space-y-6">
          {posts?.map((post) => (
            <ThreadPost
              key={post.id}
              id={post.id}
              author={post.author}
              content={post.content}
              image={post.image}
              createdAt={post.createdAt}
              likes={post.likes}
              comments={post.comments}
              shares={post.shares}
              daoMembers={post.daoMembers}
            />
          ))}
        </div>
      </div>
      <div className="space-y-8">
        <TrendingDAO />
        <DiscoverSuggestions title="Discover More" />
      </div>
    </div>
  );
};

export default Home; 