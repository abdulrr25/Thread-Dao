import Sidebar from '@/components/Sidebar';
import CreatePostForm from '@/components/CreatePostForm';
import ThreadPost from '@/components/ThreadPost';
import DiscoverSuggestions from '@/components/DiscoverSuggestions';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import TrendingDAOs from '@/components/TrendingDAO';

const Feed = () => {
  const userAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&h=250&fit=crop&auto=format";
  const userName = "Sophia";
  
  const posts = [
    {
      id: '1',
      author: {
        name: 'Alex Chen',
        handle: 'alexchen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&fit=crop&auto=format',
      },
      content: 'Just launched a DAO for fractional NFT ownership with integrated governance. Looking for founding members!',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format',
      createdAt: '2h ago',
      likes: 42,
      comments: 13,
      shares: 7,
      daoMembers: 18,
      hasJoined: false,
    },
    {
      id: '2',
      author: {
        name: 'Maya Johnson',
        handle: 'mayacrypto',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&h=250&fit=crop&auto=format',
      },
      content: 'Our DeFi protocol just completed its first community vote on treasury allocation. 65% voted for funding developer grants. Excited to see what gets built!',
      createdAt: '4h ago',
      likes: 89,
      comments: 24,
      shares: 12,
      daoMembers: 76,
      hasJoined: true,
    },
    {
      id: '3',
      author: {
        name: 'Ethan Wright',
        handle: 'ethanbuilds',
        avatar: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=250&h=250&fit=crop&auto=format',
      },
      content: 'Working on a decentralized content platform where creators earn directly from their audience. No middlemen, full ownership, built on Solana. Who wants to join?',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&auto=format',
      createdAt: '8h ago',
      likes: 125,
      comments: 32,
      shares: 18,
      daoMembers: 42,
      hasJoined: false,
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 border-r border-muted/30">
        <div className="p-4 border-b border-muted/30 flex items-center">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Landing
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Home</h1>
        </div>
        
        <div className="max-w-xl mx-auto py-4 px-4">
          <CreatePostForm userAvatar={userAvatar} userName={userName} />
          
          <div className="space-y-4">
            {posts.map((post) => (
              <ThreadPost key={post.id} {...post} />
            ))}
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block w-80 p-4 space-y-6">
        <TrendingDAOs />
        <DiscoverSuggestions title="Discover DAOs" />
      </div>
    </div>
  );
};

export default Feed;