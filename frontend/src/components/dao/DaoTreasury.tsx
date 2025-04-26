import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DaoTreasuryProps {
  treasury: string;
}

const DaoTreasury: React.FC<DaoTreasuryProps> = ({ treasury }) => {
  // Mock data for treasury history
  const treasuryData = [
    { name: 'Jan', value: 0.8 },
    { name: 'Feb', value: 1.2 },
    { name: 'Mar', value: 1.1 },
    { name: 'Apr', value: 1.5 },
    { name: 'May', value: 1.7 },
    { name: 'Jun', value: 2.1 },
    { name: 'Jul', value: 2.5 },
  ];

  // Mock data for recent transactions
  const transactions = [
    { id: '1', type: 'Deposit', amount: '0.5 ETH', user: 'alexr.eth', date: '2 days ago' },
    { id: '2', type: 'Withdrawal', amount: '0.1 ETH', user: 'mikej.eth', date: '1 week ago', description: 'Community Funding Round' },
    { id: '3', type: 'Deposit', amount: '0.3 ETH', user: 'sarahc', date: '2 weeks ago' },
    { id: '4', type: 'Withdrawal', amount: '0.05 ETH', user: 'alexr.eth', date: '1 month ago', description: 'Website Hosting' },
  ];

  // Mock data for treasury assets
  const assets = [
    { id: '1', name: 'ETH', amount: '2.2 ETH', value: '$5,500', allocation: '88%' },
    { id: '2', name: 'USDC', amount: '750 USDC', value: '$750', allocation: '12%' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">Total Treasury</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{treasury}</div>
            <div className="text-sm text-muted-foreground">≈ $6,250 USD</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">Monthly Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+19.2%</div>
            <div className="text-sm text-green-500">+0.4 ETH this month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">Treasury Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Excellent</div>
            <div className="text-sm text-muted-foreground">8+ months runway</div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="p-4 md:p-6">
        <CardHeader className="px-0">
          <CardTitle>Treasury History</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Tabs defaultValue="6m">
            <TabsList className="mb-4">
              <TabsTrigger value="1m">1M</TabsTrigger>
              <TabsTrigger value="3m">3M</TabsTrigger>
              <TabsTrigger value="6m">6M</TabsTrigger>
              <TabsTrigger value="1y">1Y</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            
            <TabsContent value="6m" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={treasuryData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => [`${value} ETH`, 'Amount']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            
            {['1m', '3m', '1y', 'all'].map(value => (
              <TabsContent key={value} value={value} className="h-80">
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Select a different time period to see data</p>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map(tx => (
                <div key={tx.id} className="flex items-start justify-between p-3 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant={tx.type === 'Deposit' ? 'default' : 'outline'}>
                        {tx.type}
                      </Badge>
                      <span className="font-medium">{tx.amount}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {tx.user} • {tx.date}
                    </div>
                    {tx.description && (
                      <div className="text-sm mt-1">
                        {tx.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Treasury Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assets.map(asset => (
                <div key={asset.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold">{asset.name}</div>
                    <div className="text-sm text-muted-foreground">{asset.allocation}</div>
                  </div>
                  <div className="mt-1">
                    <div className="font-medium">{asset.amount}</div>
                    <div className="text-sm text-muted-foreground">{asset.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DaoTreasury;
