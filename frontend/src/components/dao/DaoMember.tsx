import React from 'react';
import { DaoMember } from '@/types/dao';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface DaoMembersProps {
  members: DaoMember[];
  totalMembers: number;
}

const DaoMembers: React.FC<DaoMembersProps> = ({ members, totalMembers }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>All Members ({totalMembers})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members.map((member, i) => (
                <div key={i} className="flex items-center justify-between p-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.handle}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={member.role === "Founder" ? "default" : "outline"}>
                      {member.role}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      Joined {member.joined}
                    </div>
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
            <CardTitle>Member Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Total Members</div>
                <div className="text-2xl font-semibold">{totalMembers}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">New This Month</div>
                <div className="text-2xl font-semibold">42</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Active Members</div>
                <div className="text-2xl font-semibold">156</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Governance Participation</div>
                <div className="text-2xl font-semibold">68%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DaoMembers;
