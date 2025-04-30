'use client';

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Bell, Settings } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { useAuth } from '@/context/AuthContext';

export default function Navigation() {
  const { address } = useWallet();
  const { user } = useAuth();

  return (
    <header className="border-b border-white/10">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link to="/app" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-thread-gradient flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="font-bold text-xl">ThreadDAO</span>
          </Link>
        </div>

        <div className="flex-1 flex justify-center px-4">
          <div className="w-full max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search DAOs, posts, or users..."
                className="pl-9 bg-white/5 border-white/10"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              3
            </span>
          </Button>

          <Button variant="ghost" size="sm">
            <Settings className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-2">
            <div className="text-sm text-muted-foreground">
              {user?.username || address?.slice(0, 6) + '...' + address?.slice(-4)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 