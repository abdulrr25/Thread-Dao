import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Image,  Sparkles, Users, Search, Share } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <Card className="glass-card border-muted/40 hover:border-primary/40 transition-colors group">
      <CardContent className="p-6">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: FileText,
      title: "Post = DAO",
      description: "Every thread creates a micro-DAO with its own governance token, voting system, and member list."
    },
    {
      icon: Image,
      title: "Media Content",
      description: "Upload text, images, or videos as content, and mint them as NFTs that can be owned and traded."
    },
    {
      icon: Sparkles,
      title: "AI Writing Assistant",
      description: "AI helps you write better posts by improving clarity, tone, and grammar with smart suggestions."
    },
    {
      icon: Search,
      title: "Semantic Search",
      description: "Find posts and DAOs based on meaning, not just keywords, powered by embedding models."
    },
    {
      icon: Users,
      title: "Founder Matching",
      description: "AI suggests like-minded contributors based on wallet behavior, DAO memberships, and post topics."
    },
    {
      icon: Share,
      title: "Twitter-Style UX",
      description: "Familiar interface with infinite scroll, quick replies, likes, and shares, but fully decentralized."
    }
  ];

  return (
    <div className="py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-12">
        <span className="text-gradient">Key Features</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
