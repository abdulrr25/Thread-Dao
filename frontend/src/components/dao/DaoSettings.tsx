import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DaoData } from '@/types/dao';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface DaoSettingsProps {
  daoData: DaoData;
}

const DaoSettings: React.FC<DaoSettingsProps> = ({ daoData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="dao-name">DAO Name</Label>
                <Input id="dao-name" defaultValue={daoData.name} />
              </div>
              <div>
                <Label htmlFor="dao-description">Description</Label>
                <Textarea id="dao-description" rows={4} defaultValue={daoData.description} />
              </div>
              <div>
                <Label htmlFor="dao-type">DAO Type</Label>
                <Input id="dao-type" defaultValue={daoData.type} />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Links & Socials</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" defaultValue={daoData.links.website} />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input id="twitter" defaultValue={daoData.links.twitter} />
              </div>
              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input id="github" defaultValue={daoData.links.github} />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button>Update Links</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Governance Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="voting-power">Voting Power Type</Label>
                <Input id="voting-power" defaultValue={daoData.votingPower} />
              </div>
              <div>
                <Label htmlFor="quorum">Quorum</Label>
                <Input id="quorum" defaultValue="50%" />
              </div>
              <div>
                <Label htmlFor="proposal-threshold">Proposal Threshold</Label>
                <Input id="proposal-threshold" defaultValue="1 Token" />
              </div>
              <div>
                <Label htmlFor="voting-period">Voting Period</Label>
                <Input id="voting-period" defaultValue="7 days" />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button>Update Governance</Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Privacy & Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="public-dao">Public DAO</Label>
                  <p className="text-sm text-muted-foreground">Allow anyone to view DAO content</p>
                </div>
                <Switch id="public-dao" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="open-join">Open Joining</Label>
                  <p className="text-sm text-muted-foreground">Allow anyone to join without approval</p>
                </div>
                <Switch id="open-join" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="member-posting">Member Posting</Label>
                  <p className="text-sm text-muted-foreground">Allow all members to create posts</p>
                </div>
                <Switch id="member-posting" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="member-proposals">Member Proposals</Label>
                  <p className="text-sm text-muted-foreground">Allow all members to create proposals</p>
                </div>
                <Switch id="member-proposals" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full">Transfer Ownership</Button>
              <Button variant="outline" className="w-full">Export DAO Data</Button>
              <Button variant="destructive" className="w-full">Delete DAO</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DaoSettings;
