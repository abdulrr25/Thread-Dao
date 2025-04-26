import Sidebar from '@/components/Sidebar';
import TrendingDAOs from '@/components/TrendingDao';
import DiscoverSuggestions from '@/components/DiscoverSuggestions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Explore = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePage="explore" />
      
      <div className="flex-1">
        <div className="container max-w-6xl py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Explore DAOs</h1>
            <p className="text-muted-foreground">Discover and join DAOs that match your interests</p>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Search DAOs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, category, or description..."
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Button variant="outline" size="sm">DeFi</Button>
                <Button variant="outline" size="sm">NFTs</Button>
                <Button variant="outline" size="sm">Social</Button>
                <Button variant="outline" size="sm">Gaming</Button>
                <Button variant="outline" size="sm">Creator</Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <DiscoverSuggestions title="Featured DAOs" />
                <DiscoverSuggestions title="New DAOs" />
                <DiscoverSuggestions title="Popular in DeFi" />
              </div>
            </div>
            
            <div>
              <TrendingDAOs className="sticky top-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;