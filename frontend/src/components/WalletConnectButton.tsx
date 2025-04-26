import React from 'react';
import { Button } from "@/components/ui/button";
import { WalletIcon } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { useToast } from "@/hooks/use-toast";

const WalletConnectButton: React.FC = () => {
  const { address, isConnected, connectWallet, disconnectWallet } = useWallet();
  const { toast } = useToast();
  const shortAddress = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : '';

  const handleClick = async () => {
    try {
      if (isConnected) {
        disconnectWallet();
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected successfully.",
        });
      } else {
        await connectWallet();
        toast({
          title: "Wallet Connected",
          description: "Your wallet has been connected successfully.",
        });
      }
    } catch (error) {
      console.error('Error handling wallet connection:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleClick}
      variant={isConnected ? "outline" : "default"}
      className={`rounded-full font-medium transition-all ${isConnected ? 'bg-muted hover:bg-muted/80' : 'bg-thread-purple hover:bg-thread-purple/90'}`}
    >
      <WalletIcon className="w-4 h-4 mr-2" />
      {isConnected ? shortAddress : "Connect Wallet"}
    </Button>
  );
};

export default WalletConnectButton;