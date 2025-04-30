import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import ThreadPost from '@/components/ThreadPost';
import { 
  Users, Coins, Settings, Globe, Shield, 
  PlusCircle, MessageSquare, Share2, Heart,
  ArrowLeft, MoreVertical, Sparkles, Clock, Plus
} from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { DaoData } from '@/types/api';

interface DAO extends DaoData {
  memberCount: number;
  tokenSymbol: string;
  tokenName: string;
  isOwner: boolean;
  isMember: boolean;
  category: string;
  isPublic: boolean;
  posts: any[];
  members: any[];
  proposals: any[];
}

export default function DAOPage() {
  const { id } = useParams();
  const { address } = useWallet();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('posts');

  const { data: daoData, isLoading } = useQuery<DaoData>({
    queryKey: ['dao', id],
    queryFn: () => apiService.getDao(id || ''),
    enabled: !!id,
  });

  // Transform the API data to match our UI needs
  const dao: DAO | undefined = daoData ? {
    ...daoData,
    memberCount: 0, // TODO: Get from API
    tokenSymbol: daoData.token_symbol,
    tokenName: daoData.token_name,
    isOwner: daoData.creator_address === address,
    isMember: false, // TODO: Get from API
    category: 'social', // TODO: Get from API
    isPublic: true, // TODO: Get from API
    posts: [], // TODO: Get from API
    members: [], // TODO: Get from API
    proposals: [], // TODO: Get from API
  } : undefined;

  const handleJoinDAO = async () => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      // TODO: Implement DAO joining with contract interaction
      toast({
        title: "Success",
        description: "You have joined the DAO!",
      });
    } catch (error) {
      console.error('Error joining DAO:', error);
      toast({
        title: "Error",
        description: "Failed to join DAO. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center">Loading DAO details...</div>
      </div>
    );
  }

  if (!dao) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">DAO Not Found</h2>
          <p className="text-muted-foreground mb-4">The DAO you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/app/my-daos">Back to My DAOs</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Link to="/app/my-daos">
          <Button variant="ghost" size="sm" className="mr-3">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-1">{dao.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Badge variant="outline" className="capitalize">{dao.category}</Badge>
            <div className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" />
              <span>{dao.isPublic ? 'Public' : 'Private'} DAO</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{dao.memberCount} members</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{dao.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Coins className="h-4 w-4" />
                  <span>{dao.tokenName} ({dao.tokenSymbol})</span>
                </div>
                {dao.isOwner && (
                  <Badge variant="outline" className="gap-1">
                    <Shield className="h-3 w-3" />
                    Owner
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="governance">Governance</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-6">
              {dao.posts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No posts yet</p>
                  <Button className="gap-2 bg-thread-gradient hover:opacity-90">
                    <PlusCircle className="h-4 w-4" />
                    Create Post
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {dao.posts.map((post) => (
                    <ThreadPost
                      key={post.id}
                      id={post.id}
                      author={post.author}
                      content={post.content}
                      createdAt={post.createdAt}
                      likes={post.likes}
                      comments={post.comments}
                      shares={post.shares}
                      daoMembers={dao.memberCount}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="members" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dao.members.map((member) => (
                  <Card key={member.address} className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.handle}</p>
                      </div>
                      {member.isOwner && (
                        <Badge variant="outline" className="ml-auto gap-1">
                          <Shield className="h-3 w-3" />
                          Owner
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="governance" className="mt-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Active Proposals</h3>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/dao/${id}/proposals/new`}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Proposal
                    </Link>
                  </Button>
                </div>

                {dao.proposals.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No active proposals</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dao.proposals.map((proposal) => (
                      <Card key={proposal.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium mb-1">{proposal.title}</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              {proposal.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{proposal.votes} votes</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{proposal.timeLeft} left</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Vote
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          {!dao.isMember && !dao.isOwner && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="font-medium mb-2">Join this DAO</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Become a member to participate in discussions and governance
                  </p>
                  <Button 
                    className="w-full gap-2 bg-thread-gradient hover:opacity-90"
                    onClick={handleJoinDAO}
                  >
                    <PlusCircle className="h-4 w-4" />
                    Join DAO
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>DAO Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Members</span>
                  <span className="font-medium">{dao.memberCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Posts</span>
                  <span className="font-medium">{dao.posts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Active Proposals</span>
                  <span className="font-medium">{dao.proposals.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {dao.isOwner && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="h-4 w-4" />
                  <h3 className="font-medium">DAO Settings</h3>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Edit DAO Info
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Manage Members
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Token Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Governance Rules
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 