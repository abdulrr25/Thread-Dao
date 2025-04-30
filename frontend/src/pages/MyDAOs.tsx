import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@/context/WalletContext';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, Users, Coins, Settings, 
  ArrowLeft, Shield, Globe 
} from 'lucide-react';

interface DAO {
  id: string;
  name: string;
  description: string;
  creator_address: string;
  token_symbol: string;
  token_name: string;
  member_count: number;
  is_owner: boolean;
  is_member: boolean;
  category: string;
  is_public: boolean;
}

export default function MyDAOs() {
  const { address } = useWallet();

  const { data: daos, isLoading } = useQuery<DAO[]>({
    queryKey: ['my-daos', address],
    queryFn: () => apiService.getMyDaos(),
    enabled: !!address,
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center">Loading your DAOs...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link to="/app">
            <Button variant="ghost" size="sm" className="mr-3">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">My DAOs</h1>
        </div>
        <Button asChild className="gap-2 bg-thread-gradient hover:opacity-90">
          <Link to="/app/create-dao">
            <PlusCircle className="h-4 w-4" />
            Create DAO
          </Link>
        </Button>
      </div>

      {!daos || daos.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No DAOs Found</h3>
            <p className="text-muted-foreground mb-4">
              You haven't created or joined any DAOs yet.
            </p>
            <Button asChild className="gap-2 bg-thread-gradient hover:opacity-90">
              <Link to="/app/create-dao">
                <PlusCircle className="h-4 w-4" />
                Create Your First DAO
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {daos.map((dao) => (
            <Card key={dao.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-1">
                      <Link to={`/dao/${dao.id}`} className="hover:underline">
                        {dao.name}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="capitalize">
                        {dao.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5" />
                        <span>{dao.is_public ? 'Public' : 'Private'}</span>
                      </div>
                    </div>
                  </div>
                  {dao.is_owner && (
                    <Badge variant="outline" className="gap-1">
                      <Shield className="h-3 w-3" />
                      Owner
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {dao.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{dao.member_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4" />
                      <span>{dao.token_symbol}</span>
                    </div>
                  </div>
                  {dao.is_owner && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/dao/${dao.id}/settings`}>
                        <Settings className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}