import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { PlusCircle, Users } from 'lucide-react';

interface DiscoverSuggestionsProps {
  title: string;
}

const DiscoverSuggestions: React.FC<DiscoverSuggestionsProps> = ({ title }) => {
  // Mock data for suggested DAOs
  const suggestedDAOs = [
    {
      id: '1',
      name: 'MetaDAO',
      description: 'A community focused on the future of the metaverse and virtual worlds.',
      members: 1543,
      category: 'Metaverse',
      banner: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1ldGF2ZXJzZXxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
      id: '2',
      name: 'DeFi Innovators',
      description: 'Builders and innovators working on decentralized finance solutions.',
      members: 876,
      category: 'DeFi',
      banner: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGRlZml8ZW58MHx8MHx8fDA%3D'
    },
    {
      id: '3',
      name: 'ArtistDAO',
      description: 'Digital artists exploring NFTs and on-chain creativity.',
      members: 1289,
      category: 'Art',
      banner: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGlnaXRhbCUyMGFydHxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
      id: '4',
      name: 'GameDAO',
      description: 'A DAO for game developers and players in the web3 gaming ecosystem.',
      members: 934,
      category: 'Gaming',
      banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FtaW5nfGVufDB8fDB8fHww'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button asChild variant="outline" className="w-full justify-start">
            <Link to="/create-dao">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New DAO
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start">
            <Link to="/my-daos">
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
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Active Members</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Recent Activities</span>
              <span className="font-medium">0</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-6">{title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {suggestedDAOs.map((dao) => (
          <Card key={dao.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div 
              className="h-32 bg-cover bg-center" 
              style={{ backgroundImage: `url(${dao.banner})` }}
            />
            
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium">{dao.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {dao.category}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {dao.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {dao.members} members
                </div>
                
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/dao/${dao.id}`}>View</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DiscoverSuggestions;