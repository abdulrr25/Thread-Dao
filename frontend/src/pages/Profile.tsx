"use client"

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Users, Link as LinkIcon, ExternalLink, Sparkles } from 'lucide-react';
import ThreadPost from '@/components/ThreadPost';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useWallet } from '@/context/WalletContext';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface ProfileData {
  username: string;
  bio: string;
  avatar: string;
  walletAddress: string;
  daos: any[];
  posts: any[];
}

const Profile = () => {
  const { address, isConnected } = useWallet();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    avatar: ''
  });

  useEffect(() => {
    if (isConnected && address) {
      fetchProfile();
    }
  }, [isConnected, address]);

  const fetchProfile = async () => {
    try {
      const data = await api.getUserProfile(address!);
      setProfile(data);
      setFormData({
        username: data.username,
        bio: data.bio,
        avatar: data.avatar
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to fetch profile data",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!profile) {
        // Create new profile
        await api.createUserProfile({
          walletAddress: address!,
          ...formData
        });
      } else {
        // Update existing profile
        await api.updateUserProfile(address!, formData);
      }
      await fetchProfile();
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive"
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 p-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
              <p className="text-muted-foreground mb-4">
                Please connect your wallet to view your profile
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePage="profile" />
      
      <main className="flex-1 border-l border-muted/30">
        <div className="relative">
          {/* Cover Image */}
          <div 
            className="h-48 md:h-64 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${profile?.coverImage || 'https://via.placeholder.com/1470x640'})` }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          {/* Profile Info */}
          <div className="container max-w-6xl relative -mt-16 md:-mt-20 px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background relative z-10">
                <AvatarImage src={profile?.avatar || 'https://via.placeholder.com/256'} alt={profile?.username || 'New User'} />
                <AvatarFallback className="text-2xl">{profile?.username?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 pt-4 md:pt-16">
                <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{profile?.username || 'New User'}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>{address}</span>
                      <span>•</span>
                      <span className="text-sm">Joined {profile?.joined || 'Unknown'}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    {isEditing ? (
                      <Button variant="outline" className="gap-2">
                        <Edit className="h-4 w-4" />
                        Cancel
                      </Button>
                    ) : (
                      <Button 
                        variant="outline"
                        className="gap-2"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
                
                <p className="mt-3 text-sm md:text-base">{profile?.bio || 'No bio yet'}</p>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>
                      <strong className="text-foreground font-medium">{profile?.followers || 0}</strong> followers
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-foreground font-medium">{profile?.following || 0}</strong> following
                    </span>
                  </div>
                  
                  {profile?.website && (
                    <a 
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <LinkIcon className="h-4 w-4" />
                      {profile.website.replace(/(^\w+:|^)\/\//, '')}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="outline" className="gap-1 bg-primary/10 text-primary text-xs">
                    <Sparkles className="h-3 w-3" />
                    <span>{profile?.daosOwned || 0} DAOs Created</span>
                  </Badge>
                  <Badge variant="outline" className="gap-1 bg-secondary/10 text-secondary text-xs">
                    <Users className="h-3 w-3" />
                    <span>{profile?.daosJoined || 0} DAOs Joined</span>
                  </Badge>
                  <Badge variant="outline" className="gap-1 bg-muted text-muted-foreground text-xs">
                    <span>{profile?.postsCreated || 0} Posts</span>
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container max-w-6xl py-6 px-4 md:px-6">
          <Tabs defaultValue="posts">
            <TabsList className="w-full grid grid-cols-5 mb-6">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="daos">DAOs</TabsTrigger>
              <TabsTrigger value="nfts">NFTs</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts">
              <div className="space-y-4">
                {profile?.posts.map(post => (
                  <ThreadPost 
                    key={post.id}
                    id={post.id}
                    author={{
                      name: profile.username,
                      handle: address,
                      avatar: profile.avatar
                    }}
                    content={post.content}
                    image={post.image}
                    createdAt={post.createdAt}
                    likes={post.likes}
                    comments={post.comments}
                    shares={post.shares}
                    daoMembers={post.daoMembers}
                    hasJoined={Math.random() > 0.5}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="daos">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-thread-gradient flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">DAO #{i+1}</h3>
                          <div className="text-xs text-muted-foreground">
                            Created {i % 2 === 0 ? "2 months" : "3 weeks"} ago
                          </div>
                        </div>
                        <Badge className="ml-auto">
                          {["DeFi", "Social", "Gaming", "NFT", "Developer", "Community"][i % 6]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {i % 2 === 0 
                          ? "A community focused on building decentralized applications and tools." 
                          : "Exploring the future of web3 social platforms and content ownership."}
                      </p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground mb-4">
                        <span>{50 + i * 12} members</span>
                        <span>{10 + i * 4} posts</span>
                        <span>{i % 3 === 0 ? "Owner" : "Member"}</span>
                      </div>
                      <Button size="sm" className="w-full bg-thread-gradient hover:opacity-90">
                        View DAO
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="nfts">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-square relative bg-muted">
                      <img 
                        src={`https://picsum.photos/seed/${i+10}/300/300`} 
                        alt={`NFT #${i+1}`} 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate">ThreadDAO NFT #{i+1}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">Minted {i+1} {i === 0 ? "day" : "days"} ago</span>
                        <Badge variant="outline" className="text-xs">DAO #{i+1}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="activity">
              <div className="space-y-4">
                {[
                  { action: "Created a new DAO", target: "Web3 Developers Community", time: "2 days ago" },
                  { action: "Joined the DAO", target: "DeFi Enthusiasts", time: "1 week ago" },
                  { action: "Minted an NFT", target: "Crypto Art #123", time: "2 weeks ago" },
                  { action: "Voted on proposal", target: "Add new governance feature", time: "3 weeks ago" },
                  { action: "Created a post", target: "Thoughts on the future of DAOs", time: "1 month ago" }
                ].map((item, i) => (
                  <div key={i} className="flex p-4 border border-muted rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="mr-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xl font-semibold">{profile?.username?.charAt(0) || 'U'}</span>
                      </div>
                    </div>
                    <div>
                      <p>
                        <span className="font-medium">{profile?.username || 'New User'}</span>
                        <span className="text-muted-foreground"> {item.action}</span>
                      </p>
                      <p className="text-primary font-medium">{item.target}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="about">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Profile Details</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Full Name</div>
                        <div>{profile?.username || 'New User'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Web3 Address</div>
                        <div>{address}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Website</div>
                        <div>{profile?.website || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Member Since</div>
                        <div>{profile?.joined || 'Unknown'}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">DAO Stats</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">DAOs Created</div>
                        <div>{profile?.daosOwned || 0}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">DAOs Joined</div>
                        <div>{profile?.daosJoined || 0}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Total Posts</div>
                        <div>{profile?.postsCreated || 0}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Governance Participation</div>
                        <div>78%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;