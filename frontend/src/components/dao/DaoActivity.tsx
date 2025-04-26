import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ActivityEvent } from '@/types/dao';
import { Badge } from '@/components/ui/badge';
import { Bell, Users, Wallet, Zap, FileText } from 'lucide-react';

interface DaoActivityProps {
  activity: ActivityEvent[];
}

const DaoActivity: React.FC<DaoActivityProps> = ({ activity }) => {
  // Additional mock activity data for display
  const allActivity = [
    ...activity,
    { event: 'Proposal vote ended', time: '1 week ago', user: 'system' },
    { event: 'New member joined', time: '2 weeks ago', user: 'davidk.eth' },
    { event: 'Proposal created', time: '2 weeks ago', user: 'sarahc' },
    { event: 'Treasury withdrawal', time: '3 weeks ago', amount: '0.2 ETH', user: 'alexr.eth' },
    { event: 'DAO settings updated', time: '1 month ago', user: 'alexr.eth' },
  ];

  const getActivityIcon = (event: string) => {
    if (event.includes('member')) return <Users className="h-4 w-4" />;
    if (event.includes('Proposal')) return <FileText className="h-4 w-4" />;
    if (event.includes('Treasury') || event.includes('fund')) return <Wallet className="h-4 w-4" />;
    if (event.includes('vote')) return <Zap className="h-4 w-4" />;
    return <Bell className="h-4 w-4" />;
  };

  const getActivityBadge = (event: string) => {
    if (event.includes('joined')) return 'Member';
    if (event.includes('Proposal')) return 'Governance';
    if (event.includes('Treasury') || event.includes('fund') || event.includes('received')) return 'Treasury';
    if (event.includes('vote')) return 'Vote';
    if (event.includes('settings')) return 'Settings';
    return 'Activity';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>All Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allActivity.map((item, index) => (
                <div key={index} className="flex gap-3 p-4 border rounded-lg">
                  <div className="mt-1">
                    <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                      {getActivityIcon(item.event)}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.event}</span>
                      <Badge variant="outline" className="text-xs">
                        {getActivityBadge(item.event)}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mt-1">
                      {item.user && `By ${item.user} • `}{item.time}
                    </div>
                    
                    {item.amount && (
                      <div className="text-sm font-medium mt-1">
                        Amount: {item.amount}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">New Members (30 days)</div>
                <div className="text-2xl font-semibold">4</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Proposals Created</div>
                <div className="text-2xl font-semibold">2</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Governance Participation</div>
                <div className="text-2xl font-semibold">74%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Treasury Transactions</div>
                <div className="text-2xl font-semibold">7</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Most Active Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div className="font-medium">alexr.eth</div>
                <Badge>Founder</Badge>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div className="font-medium">mikej.eth</div>
                <Badge variant="outline">Contributor</Badge>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div className="font-medium">sarahc</div>
                <Badge variant="outline">Member</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DaoActivity;
