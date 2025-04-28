"use client"

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Users, Link as LinkIcon, ExternalLink, Sparkles, Loader2 } from 'lucide-react';
import ThreadPost from '@/components/ThreadPost';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useWallet } from '@/context/WalletContext';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be at most 20 characters'),
  bio: z.string().max(160, 'Bio must be at most 160 characters'),
  avatar: z.string().url('Avatar must be a valid URL'),
  website: z.string().url('Website must be a valid URL').optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileData extends Omit<ProfileFormData, 'website'> {
  wallet_address: string;
  daos: DAO[];
  posts: Post[];
  followers: number;
  following: number;
  daosOwned: number;
  daosJoined: number;
  postsCreated: number;
  joined: string;
  coverImage?: string;
  website?: string;
}

interface Post {
  id: string;
  content: string;
  image?: string;
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  daoMembers: number;
}

interface DAO {
  id: string;
  name: string;
  description: string;
  members: number;
  proposals: number;
  activeMembers: number;
}

const Profile = () => {
  const { publicKey, connected } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', publicKey],
    queryFn: () => api.getUserProfile(publicKey!),
    enabled: !!publicKey,
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || '',
      bio: profile?.bio || '',
      avatar: profile?.avatar || '',
      website: profile?.website || '',
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileFormData) => 
      profile ? api.updateUserProfile(publicKey!, data) : api.createUserProfile({ 
        wallet_address: publicKey!, 
        username: data.username,
        bio: data.bio || '',
        avatar: data.avatar || '',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', publicKey] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  if (!connected) {
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 p-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Error Loading Profile</h2>
              <p className="text-muted-foreground mb-4">
                {error instanceof Error ? error.message : "Failed to load profile data"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
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
                      <span>{publicKey}</span>
                      <span>•</span>
                      <span className="text-sm">Joined {profile?.joined || 'Unknown'}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    {isEditing ? (
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => {
                          setIsEditing(false);
                          reset();
                        }}
                      >
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
                
                {isEditing ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                    <div>
                      <Input
                        {...register('username')}
                        placeholder="Username"
                        className={errors.username ? 'border-red-500' : ''}
                      />
                      {errors.username && (
                        <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Textarea
                        {...register('bio')}
                        placeholder="Bio"
                        className={errors.bio ? 'border-red-500' : ''}
                      />
                      {errors.bio && (
                        <p className="text-sm text-red-500 mt-1">{errors.bio.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Input
                        {...register('avatar')}
                        placeholder="Avatar URL"
                        className={errors.avatar ? 'border-red-500' : ''}
                      />
                      {errors.avatar && (
                        <p className="text-sm text-red-500 mt-1">{errors.avatar.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Input
                        {...register('website')}
                        placeholder="Website URL"
                        className={errors.website ? 'border-red-500' : ''}
                      />
                      {errors.website && (
                        <p className="text-sm text-red-500 mt-1">{errors.website.message}</p>
                      )}
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={updateProfileMutation.isPending}
                      className="w-full"
                    >
                      {updateProfileMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </form>
                ) : (
                  <>
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
                  </>
                )}
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
                {profile?.posts.map((post: Post) => (
                  <ThreadPost 
                    key={post.id}
                    id={post.id}
                    author={{
                      name: profile.username,
                      handle: publicKey || '',
                      avatar: profile.avatar || ''
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
                {profile?.daos.map((dao: DAO) => (
                  <Card key={dao.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-thread-gradient flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{dao.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{dao.members} members</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{dao.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="gap-1">
                          <Sparkles className="h-3 w-3" />
                          <span>{dao.proposals} proposals</span>
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Users className="h-3 w-3" />
                          <span>{dao.activeMembers} active</span>
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="nfts">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-muted/30"></div>
                    <CardContent className="p-4">
                      <h3 className="font-medium">NFT #{i + 1}</h3>
                      <p className="text-sm text-muted-foreground">Collection Name</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="activity">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted/30"></div>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">Activity {i + 1}</span>
                            <span className="text-muted-foreground"> • 2 hours ago</span>
                          </p>
                          <p className="text-sm text-muted-foreground">Description of activity</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="about">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">About</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Bio</h3>
                      <p className="text-muted-foreground">{profile?.bio || 'No bio yet'}</p>
                    </div>
                    
                    {profile?.website && (
                      <div>
                        <h3 className="font-medium mb-2">Website</h3>
                        <a 
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="text-primary hover:underline"
                        >
                          {profile.website}
                        </a>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-medium mb-2">Wallet Address</h3>
                      <p className="text-muted-foreground font-mono">{publicKey}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;