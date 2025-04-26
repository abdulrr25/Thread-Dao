import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

interface TrendingDAOsProps {
  className?: string;
}

const TrendingDAOs: React.FC<TrendingDAOsProps> = ({ className }) => {
  // Mock trending DAOs data
  const trendingDAOs = [
    { id: '1', name: 'MetaCollective', members: 1234, category: 'Social' },
    { id: '2', name: 'DeFi Alliance', members: 876, category: 'DeFi' },
    { id: '3', name: 'NFT Creators', members: 543, category: 'NFTs' },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Trending DAOs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trendingDAOs.map((dao) => (
            <div key={dao.id} className="flex items-center justify-between">
              <div>
                <Link
                  to={`/dao/${dao.id}`}
                  className="font-medium hover:text-primary transition-colors"
                >
                  {dao.name}
                </Link>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{dao.members} members</span>
                  <Badge variant="outline" className="text-xs">
                    {dao.category}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/dao/${dao.id}`}>View</Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingDAOs;