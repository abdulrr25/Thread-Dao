import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Users, Coins, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TrendingDAO {
  id: string;
  name: string;
  description: string;
  category: string;
  member_count: number;
  token_symbol: string;
  is_public: boolean;
}

export function TrendingDAO() {
  const { data: trendingDaos, error } = useQuery({
    queryKey: ['trendingDaos'],
    queryFn: () => api.getTrendingDaos()
  });

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trending DAOs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Failed to load trending DAOs
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Trending DAOs</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/my-daos" className="flex items-center gap-1">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trendingDaos?.map((dao: TrendingDAO) => (
            <Link key={dao.id} to={`/dao/${dao.id}`}>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium mb-1">{dao.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                      {dao.description}
                    </p>
                    <div className="flex items-center gap-3 text-sm">
                      <Badge variant="outline" className="capitalize">
                        {dao.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span>{dao.member_count}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Coins className="h-3.5 w-3.5" />
                        <span>{dao.token_symbol}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Globe className="h-3.5 w-3.5" />
                    <span>{dao.is_public ? 'Public' : 'Private'}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}