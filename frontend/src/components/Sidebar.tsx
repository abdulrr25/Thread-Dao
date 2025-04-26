import React from 'react';
import { Button } from "@/components/ui/button";
import { Home, Search, Bell, Sparkles, Users, PlusCircle, User } from 'lucide-react';
import WalletConnectButton from './WalletConnectButton';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '@/context/WalletContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isConnected } = useWallet();

  const navItems = [
    { name: 'Home', icon: Home, href: '/feed' },
    { name: 'Explore', icon: Search, href: '/explore' },
    { name: 'Notifications', icon: Bell, href: '/notifications' },
    { name: 'Semantic Search', icon: Sparkles, href: '/semantic-search' },
    { name: 'My DAOs', icon: Users, href: '/my-daos' },
    { name: 'Profile', icon: User, href: '/profile' }
  ];

  const isActive = (href: string) => {
    if (href === '/feed') {
      return location.pathname === '/feed' || location.pathname === '/';
    }
    return location.pathname === href;
  };

  return (
    <div className="h-screen sticky top-0 w-64 border-r border-muted/30 p-4 flex flex-col">
      <div className="mb-6 flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-thread-gradient flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gradient">ThreadDAO</h1>
      </div>
      
      <nav className="space-y-1 mb-6">
        {navItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            asChild
            className={`w-full justify-start text-base font-medium ${
              isActive(item.href)
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Link to={item.href}>
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          </Button>
        ))}
      </nav>
      
      <Button 
        variant="default" 
        className="w-full bg-thread-gradient hover:opacity-90 rounded-full mb-auto"
        disabled={!isConnected}
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        New Post
      </Button>
      
      <div className="mt-6">
        <WalletConnectButton />
      </div>
    </div>
  );
};

export default Sidebar;