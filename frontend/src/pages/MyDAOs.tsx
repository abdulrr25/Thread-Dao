import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Sparkles, PlusCircle } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface Dao {
  id: string;
  name: string;
  description: string;
  creatorAddress: string;
  tokenName: string;
  tokenSymbol: string;
  members: any[];
  posts: any[];
}

const MyDaos = () => {
  const { address, isConnected } = useWallet();
  const { toast } = useToast();
  const [daos, setDaos] = useState<Dao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected && address) {
      fetchDaos();
    }
  }, [isConnected, address]);

  const fetchDaos = async () => {
    try {
      setLoading(true);
      const data = await api.getUserDaos(address!);
      setDaos(data);
    } catch (error) {
      console.error('Error fetching DAOs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch DAOs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 p-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
              <p className="text-muted-foreground mb-4">
                Please connect your wallet to view your DAOs
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My DAOs</h1>
          <Button asChild>
            <Link to="/create-dao">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New DAO
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading your DAOs...</p>
          </div>
        ) : daos.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-bold mb-2">No DAOs Created Yet</h2>
              <p className="text-muted-foreground mb-4">
                You haven't created any DAOs yet. Create your first DAO to get started!
              </p>
              <Button asChild>
                <Link to="/create-dao">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First DAO
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {daos.map((dao) => (
              <Card key={dao.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{dao.name}</span>
                    <Badge variant="outline" className="gap-1">
                      <Sparkles className="h-3 w-3" />
                      {dao.tokenSymbol}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{dao.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{dao.members.length} members</span>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={`/dao/${dao.id}`}>
                        View DAO
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDaos;