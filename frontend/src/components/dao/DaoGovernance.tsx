import React from 'react';
import { DaoProposal } from '@/types/dao';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface DaoGovernanceProps {
  proposals: DaoProposal[];
  votingPower: string;
  proposalsCount: number;
}

const DaoGovernance: React.FC<DaoGovernanceProps> = ({ proposals, votingPower, proposalsCount }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Active Proposals ({proposalsCount})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {proposals.map(proposal => (
                <div key={proposal.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{proposal.title}</h3>
                      <div className="text-sm text-muted-foreground">
                        Proposed by {proposal.createdBy} • {proposal.created}
                      </div>
                    </div>
                    <Badge variant={proposal.status === "Active" ? "default" : "outline"}>
                      {proposal.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm mb-4">{proposal.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>For: {proposal.votes.for}</span>
                      <span>Against: {proposal.votes.against}</span>
                    </div>
                    <Progress 
                      value={proposal.votes.for / (proposal.votes.for + proposal.votes.against) * 100} 
                      className="h-2" 
                    />
                  </div>
                  
                  {proposal.status === "Active" && (
                    <div className="flex gap-2 mt-4">
                      <Button className="flex-1">Vote For</Button>
                      <Button variant="outline" className="flex-1">Vote Against</Button>
                    </div>
                  )}
                  
                  <div className="text-sm text-muted-foreground mt-4">
                    {proposal.status === "Active" ? proposal.ends : "Voting has ended"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Create New Proposal</Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Governance Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Voting Power</div>
                <div className="text-lg font-semibold">{votingPower}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Proposals Count</div>
                <div className="text-lg font-semibold">{proposalsCount}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Your Voting Power</div>
                <div className="text-lg font-semibold">1.2 Tokens</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Quorum</div>
                <div className="text-lg font-semibold">50% of token holders</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-md">
                <div className="text-sm font-medium">Proposal Passed</div>
                <div className="text-sm text-muted-foreground">Community Funding Round • 3 days ago</div>
              </div>
              <div className="p-3 border rounded-md">
                <div className="text-sm font-medium">New Proposal Created</div>
                <div className="text-sm text-muted-foreground">Add NFT Creation Tools • 5 days ago</div>
              </div>
              <div className="p-3 border rounded-md">
                <div className="text-sm font-medium">Vote Cast</div>
                <div className="text-sm text-muted-foreground">alexr.eth voted for Community Funding • 1 week ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DaoGovernance;
