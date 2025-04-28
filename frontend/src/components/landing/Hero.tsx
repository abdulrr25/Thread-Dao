import { Button } from "../ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative flex flex-col items-center text-center max-w-4xl mx-auto py-24 px-6 sm:px-8">
      {/* Floating Icon */}
      <div className="h-24 w-24 rounded-full bg-thread-gradient flex items-center justify-center mb-10 shadow-lg animate-float">
        <Sparkles className="h-14 w-14 text-white drop-shadow-md" />
      </div>

      {/* Title */}
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
        <span className="bg-clip-text text-transparent bg-thread-gradient">
          ThreadDAO
        </span>{" "}
        — Social Reimagined for <span className="text-gradient">Web3</span>
      </h1>

      {/* Description */}
      <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl">
        A decentralized social platform where every post becomes a micro-DAO. 
        Own your content, discover communities, and explore with semantic search — 
        all with a familiar social media experience.
      </p>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          size="lg"
          className="rounded-full bg-thread-gradient hover:opacity-90 hover:scale-105 transition-transform duration-300"
          onClick={() => navigate("/feed")}
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Launch App
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="rounded-full border-muted hover:border-primary hover:text-primary transition-all"
          onClick={() => navigate("/explore")}
        >
          Learn More
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Hero Image */}
      <div className="relative w-full max-w-5xl h-72 mt-20">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-thread-gradient opacity-20 rounded-2xl blur-2xl animate-pulse-glow"></div>

        {/* Image Card */}
        <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl backdrop-blur-md bg-white/10">
          <img
            src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
            alt="ThreadDAO Interface"
            className="object-cover w-full h-72"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
