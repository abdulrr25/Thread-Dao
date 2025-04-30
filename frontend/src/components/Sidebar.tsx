import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search, Bell, Sparkles, Users, PlusCircle, User } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';

const navItems = [
  { name: 'Home', icon: Home, href: '/app' },
  { name: 'Explore', icon: Search, href: '/app/explore' },
  { name: 'Notifications', icon: Bell, href: '/app/notifications' },
  { name: 'Semantic Search', icon: Sparkles, href: '/app/semantic-search' },
  { name: 'My DAOs', icon: Users, href: '/app/my-daos' },
  { name: 'Profile', icon: User, href: '/app/profile' }
];

export default function Sidebar() {
  const location = useLocation();
  const { address } = useWallet();

  const isActive = (href: string) => {
    if (href === '/app') {
      return location.pathname === '/app' || location.pathname === '/app/';
    }
    return location.pathname === href;
  };

  return (
    <div className="w-64 min-h-screen border-r border-white/10 p-4">
      <div className="space-y-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Navigation</h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Create</h2>
          <div className="space-y-1">
            <Link to="/app/create-post">
              <Button
                variant="default"
                className="w-full justify-start gap-2 bg-thread-gradient hover:opacity-90"
              >
                <PlusCircle className="h-4 w-4" />
                Create DAO
              </Button>
            </Link>
          </div>
        </div>

        <div className="px-3 py-2">
          <div className="rounded-lg bg-white/5 p-4">
            <h3 className="font-semibold mb-2">Wallet Connected</h3>
            <p className="text-sm text-muted-foreground break-all">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}