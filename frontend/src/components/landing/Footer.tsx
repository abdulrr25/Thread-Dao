import React from 'react';
import { Sparkles, Twitter, Github, MessageCircle, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Input } from "@/components/ui/input";
import { Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigation = (path: string) => {
    if (path.startsWith('/app') && !user) {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">ThreadDao</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Join the future of decentralized social media. Create, share, and earn with ThreadDao.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/threaddao" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm">
                  <Twitter className="h-5 w-5" />
                </Button>
              </a>
              <a href="https://github.com/threaddao" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm">
                  <Github className="h-5 w-5" />
                </Button>
              </a>
              <a href="https://linkedin.com/company/threaddao" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm">
                  <Linkedin className="h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Careers</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 ThreadDao. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
