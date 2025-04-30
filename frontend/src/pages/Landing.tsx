import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, Users, Shield, Coins, 
  MessageSquare, Sparkles, Globe 
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-thread-gradient">
              Decentralized Governance Made Simple
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Create and manage your DAO with ease. ThreadDAO provides a seamless experience for decentralized organizations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-thread-gradient hover:opacity-90">
                <Link to="/app/create-dao">
                  Create DAO
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">
                  Connect Wallet
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose ThreadDAO?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides everything you need to run a successful DAO
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-background">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Member Management</h3>
              <p className="text-muted-foreground">
                Easily manage your DAO members, roles, and permissions
              </p>
            </div>

            <div className="p-6 rounded-lg bg-background">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Governance</h3>
              <p className="text-muted-foreground">
                Implement transparent voting and proposal systems
              </p>
            </div>

            <div className="p-6 rounded-lg bg-background">
              <Coins className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Token Management</h3>
              <p className="text-muted-foreground">
                Create and manage your DAO's token economy
              </p>
            </div>

            <div className="p-6 rounded-lg bg-background">
              <MessageSquare className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community Engagement</h3>
              <p className="text-muted-foreground">
                Foster discussions and collaboration among members
              </p>
            </div>

            <div className="p-6 rounded-lg bg-background">
              <Sparkles className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Assistance</h3>
              <p className="text-muted-foreground">
                Get AI-powered suggestions for DAO structure and governance
              </p>
            </div>

            <div className="p-6 rounded-lg bg-background">
              <Globe className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Global Access</h3>
              <p className="text-muted-foreground">
                Connect with DAOs and members from around the world
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your DAO Journey?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of organizations already using ThreadDAO for their governance needs
          </p>
          <Button asChild size="lg" className="bg-thread-gradient hover:opacity-90">
            <Link to="/app/create-dao">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 