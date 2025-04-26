import React from 'react';
import { Badge } from "@/components/ui/badge";

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Connect Your Wallet",
      description: "Start by connecting your wallet to access the ThreadDAO platform securely.",
      color: "bg-thread-purple"
    },
    {
      number: "02",
      title: "Create a Post",
      description: "Compose your content with optional AI assistance to perfect your message.",
      color: "bg-thread-teal"
    },
    {
      number: "03",
      title: "DAO is Created",
      description: "Upon publishing, a micro-DAO is created with you as the founder and your content at its center.",
      color: "bg-thread-pink"
    },
    {
      number: "04",
      title: "Community Engagement",
      description: "Others discover your DAO, join as members, and engage through comments, votes, and content minting.",
      color: "bg-thread-purple"
    }
  ];

  return (
    <div className="py-16 px-4 bg-thread-dark/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-1 text-primary bg-primary/10 border-primary/20">
            Simple Process
          </Badge>
          <h2 className="text-3xl font-bold mb-4">How ThreadDAO Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From posting content to creating a thriving micro-DAO, our process is straightforward and intuitive.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-6">
              <div className={`h-12 w-12 rounded-full ${step.color} flex-shrink-0 flex items-center justify-center text-white font-bold`}>
                {step.number}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-thread-gradient opacity-10 rounded-xl blur-3xl"></div>
          <div className="relative z-10 rounded-xl overflow-hidden border border-primary/20">
            <img 
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
              alt="ThreadDAO Interface" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
