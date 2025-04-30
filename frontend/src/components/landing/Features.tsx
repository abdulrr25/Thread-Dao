import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Image, Sparkles, Users, Search, Share, Lock, Coins } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <div className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-primary/30 transition-all duration-300">
    <div className="absolute inset-0 bg-thread-gradient opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300"></div>
    <div className="relative z-10">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  </div>
);

const Features: React.FC = () => {
  const features = [
    {
      icon: FileText,
      title: "Post = DAO",
      description: "Transform your content into a micro-DAO with its own governance token, voting system, and member list."
    },
    {
      icon: Image,
      title: "NFT Content",
      description: "Mint your posts as NFTs, enabling true ownership and monetization of your content."
    },
    {
      icon: Sparkles,
      title: "AI Assistant",
      description: "Enhance your posts with AI-powered writing assistance, content suggestions, and engagement analytics."
    },
    {
      icon: Search,
      title: "Semantic Search",
      description: "Discover relevant content and communities using advanced AI-powered semantic search technology."
    },
    {
      icon: Users,
      title: "Smart Matching",
      description: "Connect with like-minded creators and communities through our intelligent matching algorithm."
    },
    {
      icon: Share,
      title: "Decentralized Sharing",
      description: "Share content across the Web3 ecosystem while maintaining full ownership and control."
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your data stays private and secure with end-to-end encryption and decentralized storage."
    },
    {
      icon: Coins,
      title: "Token Rewards",
      description: "Earn tokens for creating valuable content and engaging with the community."
    }
  ];

  return (
    <div id="features" className="py-24 px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="text-gradient">Powerful Features</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to create, manage, and grow your decentralized social presence.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {features.map((feature, idx) => (
          <FeatureCard
            key={idx}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Features;
