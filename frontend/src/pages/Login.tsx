import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/context/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { connect, address } = useWallet();
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      await connect();
      toast({
        title: "Success",
        description: "Wallet connected successfully!",
      });
      navigate('/app');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Error",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to ThreadDAO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground mb-6">
            Connect your wallet to start managing your DAOs
          </p>
          <Button
            onClick={handleConnect}
            className="w-full gap-2 bg-thread-gradient hover:opacity-90"
          >
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 