import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@/context/WalletContext';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, Users, Coins, ArrowRight,
  PlusCircle, Globe, Shield 
} from 'lucide-react';

interface TrendingDAO {
  id: string;
  name: string;
  description: string;
  member_count: number;
  token_symbol: string;
  category: string;
  is_public: boolean;
}

interface RecentActivity {
  id: string;
  type: 'proposal' | 'member' | 'token';
  dao_id: string;
  dao_name: string;
  description: string;
  timestamp: string;
}

interface ApiResponse<T> {
  data: T;
  error?: string;
}

export default function Home() {
  const { address } = useWallet();
  const { toast } = useToast();

  const { data: trendingDaosResponse, isLoading: isLoadingTrending } = useQuery<ApiResponse<TrendingDAO[]>, Error>({
    queryKey: ['trending-daos'],
    queryFn: () => apiService.getTrendingDaos(),
  });

  const { data: activitiesResponse, isLoading: isLoadingActivities } = useQuery<ApiResponse<RecentActivity[]>, Error>({
    queryKey: ['recent-activities'],
    queryFn: () => apiService.getRecentActivities(),
  });

  const trendingDaos = trendingDaosResponse?.data ?? [];
  const recentActivities = activitiesResponse?.data ?? [];

  if (isLoadingTrending || isLoadingActivities) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (trendingDaosResponse?.error || activitiesResponse?.error) {
    toast({
      title: "Error",
      description: trendingDaosResponse?.error || activitiesResponse?.error,
      variant: "destructive",
    });
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Welcome to ThreadDAO</h1>
        <Button asChild className="gap-2 bg-thread-gradient hover:opacity-90">
          <Link to="/app/create-dao">
            <PlusCircle className="h-4 w-4" />
            Create DAO
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Trending DAOs Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending DAOs
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/app/my-daos" className="flex items-center gap-1">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {trendingDaosResponse?.error ? (
                <div className="text-center text-muted-foreground">
                  {trendingDaosResponse.error}
                </div>
              ) : (
                <div className="space-y-4">
                  {trendingDaos.map((dao: TrendingDAO) => (
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
              )}
            </CardContent>
          </Card>

          {/* Recent Activities Section */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              {activitiesResponse?.error ? (
                <div className="text-center text-muted-foreground">
                  {activitiesResponse.error}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity: RecentActivity) => (
                    <Card key={activity.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          {activity.type === 'proposal' && (
                            <Shield className="h-5 w-5 text-primary" />
                          )}
                          {activity.type === 'member' && (
                            <Users className="h-5 w-5 text-primary" />
                          )}
                          {activity.type === 'token' && (
                            <Coins className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Link 
                              to={`/dao/${activity.dao_id}`}
                              className="font-medium hover:underline"
                            >
                              {activity.dao_name}
                            </Link>
                            <Badge variant="outline" className="capitalize">
                              {activity.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {activity.description}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/app/create-dao">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New DAO
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/app/my-daos">
                  <Users className="mr-2 h-4 w-4" />
                  My DAOs
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>DAO Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total DAOs</span>
                  <span className="font-medium">{trendingDaos.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Active Members</span>
                  <span className="font-medium">
                    {trendingDaos.reduce((acc, dao) => acc + dao.member_count, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Recent Activities</span>
                  <span className="font-medium">{recentActivities.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 