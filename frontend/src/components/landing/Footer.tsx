import React from 'react';
import { Sparkles, Twitter, Github, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-4 border-t border-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-thread-gradient flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gradient">ThreadDAO</h2>
            </div>
            <p className="text-muted-foreground text-sm">
              Decentralized social platform where every post creates a micro-DAO.
            </p>
            <div className="flex mt-4 space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary">Home</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Explore</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Semantic Search</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">My DAOs</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary">Documentation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">API</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">GitHub</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Whitepaper</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-muted/30 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            &copy; 2025 ThreadDAO. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-primary">Terms of Service</a>
            <a href="#" className="text-muted-foreground hover:text-primary">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
