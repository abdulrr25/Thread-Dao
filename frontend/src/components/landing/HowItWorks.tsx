import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Wallet, MessageSquare, Users, Coins } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Connect Your Wallet",
      description: "Connect your Web3 wallet to access ThreadDAO's decentralized features and manage your digital assets.",
      icon: Wallet,
      color: "bg-thread-purple"
    },
    {
      number: "02",
      title: "Create Your Content",
      description: "Write posts, share media, or start discussions. Our AI assistant helps you create engaging content.",
      icon: MessageSquare,
      color: "bg-thread-teal"
    },
    {
      number: "03",
      title: "Launch Your DAO",
      description: "Your post automatically creates a micro-DAO with governance tokens and voting rights for members.",
      icon: Users,
      color: "bg-thread-pink"
    },
    {
      number: "04",
      title: "Earn & Engage",
      description: "Earn tokens for valuable contributions and engage with your community through voting and discussions.",
      icon: Coins,
      color: "bg-thread-purple"
    }
  ];

  return (
    <div className="py-24 px-4 bg-thread-dark/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-1 text-primary bg-primary/10 border-primary/20">
            Simple Process
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How ThreadDAO Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From creating content to building a thriving community, our platform makes Web3 social simple and rewarding.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-6 group">
              <div className={`h-14 w-14 rounded-xl ${step.color} flex-shrink-0 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-muted-foreground">{step.number}</span>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent rounded-3xl"></div>
          <img
            src="/images/platform-preview.png"
            alt="ThreadDao Platform Preview"
            className="relative z-10 rounded-3xl shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
