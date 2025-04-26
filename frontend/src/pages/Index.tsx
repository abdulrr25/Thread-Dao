import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

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