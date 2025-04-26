import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center text-center max-w-3xl mx-auto my-16 px-4">
      <div className="h-20 w-20 rounded-full bg-thread-gradient flex items-center justify-center mb-8 animate-float">
        <Sparkles className="h-12 w-12 text-white" />
      </div>
      
      <h1 className="text-5xl font-bold mb-6 leading-tight">
        <span className="text-gradient">ThreadDAO</span>: Where Social Meets <span className="text-gradient">Web3</span>
      </h1>
      
      <p className="text-xl text-muted-foreground mb-8">
        A decentralized social platform where every post creates a micro-DAO. 
        Own your content, engage with communities, and discover through 
        semantic search - all with familiar social media UX.
      </p>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <Button 
          size="lg" 
          className="rounded-full bg-thread-gradient hover:opacity-90"
          onClick={() => navigate('/feed')}
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Launch App
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="rounded-full"
          onClick={() => navigate('/explore')}
        >
          Learn More
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
      
      <div className="relative w-full h-64 mt-16">
        <div className="absolute inset-0 bg-thread-gradient opacity-10 rounded-xl blur-3xl animate-pulse-glow"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
            alt="ThreadDAO Interface" 
            className="rounded-xl shadow-2xl max-h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
