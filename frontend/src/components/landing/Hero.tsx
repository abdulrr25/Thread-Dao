import { Button } from "../ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLaunchApp = () => {
    if (user) {
      navigate("/app");
    } else {
      navigate("/login");
    }
  };

  const handleLearnMore = () => {
    // Scroll to features section
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative flex flex-col items-center text-center max-w-5xl mx-auto py-32 px-6 sm:px-8">
      {/* Floating Icon */}
      <div className="h-24 w-24 rounded-full bg-thread-gradient flex items-center justify-center mb-10 shadow-lg animate-float">
        <Sparkles className="h-14 w-14 text-white drop-shadow-md" />
      </div>

      {/* Title */}
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
        <span className="bg-clip-text text-transparent bg-thread-gradient">
          ThreadDAO
        </span>{" "}
        — Where Every Post is a{" "}
        <span className="text-gradient">Micro-DAO</span>
      </h1>

      {/* Description */}
      <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl">
        Experience the future of social media where your content becomes a decentralized autonomous organization. 
        Own your data, build communities, and earn rewards — all powered by Web3.
      </p>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          size="lg"
          className="rounded-full bg-thread-gradient hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/20"
          onClick={handleLaunchApp}
        >
          <Sparkles className="mr-2 h-5 w-5" />
          {user ? "Go to App" : "Launch App"}
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="rounded-full border-muted hover:border-primary hover:text-primary transition-all duration-300"
          onClick={handleLearnMore}
        >
          Learn More
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Hero Image */}
      <div className="relative w-full max-w-5xl h-80 mt-20">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-thread-gradient opacity-20 rounded-2xl blur-2xl animate-pulse-glow"></div>

        {/* Image Card */}
        <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl backdrop-blur-md bg-white/10 border border-white/10 hover:border-primary/30 transition-all duration-300">
          <img
            src="/images/hero-preview.png"
            alt="ThreadDAO Interface"
            className="object-cover w-full h-80"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
