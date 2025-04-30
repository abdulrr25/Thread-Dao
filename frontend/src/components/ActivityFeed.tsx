import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Shield, Users, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Activity {
  id: string;
  type: 'proposal' | 'member' | 'token';
  dao_id: string;
  dao_name: string;
  description: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
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
      </CardContent>
    </Card>
  );
} 