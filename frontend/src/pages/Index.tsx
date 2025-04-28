import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Footer from '../components/landing/Footer';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Users, Clock } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const { data: featuredDaos, isLoading: isLoadingDaos } = useQuery({
    queryKey: ['featuredDaos'],
    queryFn: () => api.getFeaturedDaos(),
  });

  const { data: trendingPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['trendingPosts'],
    queryFn: () => api.getTrendingPosts(),
  });

  return (
    <div className="min-h-screen">
      <header className="py-6 px-8 flex justify-between items-center border-b border-muted/30">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-thread-gradient flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="font-bold text-xl">ThreadDAO</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-muted-foreground hover:text-foreground">Features</a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground">How it Works</a>
          <a href="#featured" className="text-muted-foreground hover:text-foreground">Featured</a>
          <a href="#" className="text-muted-foreground hover:text-foreground">Docs</a>
          <a href="#" className="text-muted-foreground hover:text-foreground">Community</a>
        </nav>
        
        <div>
          <Button 
            variant="default" 
            className="rounded-full bg-thread-gradient hover:opacity-90"
            onClick={() => navigate('/feed')}
          >
            Launch App
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>
      
      <main>
        <Hero />
        
        <div id="featured" className="py-16 bg-muted/30">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Featured DAOs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingDaos ? (
                <div>Loading featured DAOs...</div>
              ) : featuredDaos?.map((dao: any) => (
                <Card key={dao.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={dao.avatar} alt={dao.name} />
                        <AvatarFallback>{dao.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{dao.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{dao.members} members</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
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
          </div>
        </div>

        <div className="py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Trending Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoadingPosts ? (
                <div>Loading trending posts...</div>
              ) : trendingPosts?.map((post: any) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{post.author.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">@{post.author.handle}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.createdAt}
                      </span>
                      <span>{post.likes} likes</span>
                      <span>{post.comments} comments</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        <div id="features">
          <Features />
        </div>
        <div id="how-it-works">
          <HowItWorks />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;