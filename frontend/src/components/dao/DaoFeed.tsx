import React from 'react';
import { Post } from '@/types/dao';
import CreatePostForm from '@/components/CreatePostForm';
import ThreadPost from '@/components/ThreadPost';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { InfoIcon, TrendingUp, Users } from 'lucide-react';
import { DaoData } from '@/types/dao';

interface DaoFeedProps {
  daoData: DaoData;
  joined: boolean;
}

const DaoFeed: React.FC<DaoFeedProps> = ({ daoData, joined }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {joined && (
          <CreatePostForm 
            userAvatar={daoData.founder.avatar}
            userName={daoData.founder.name}
          />
        )}
        
        <div className="space-y-4">
          {daoData.posts.map(post => (
            <ThreadPost 
              key={post.id}
              id={post.id}
              author={post.author}
              content={post.content}
              image={post.image}
              createdAt={post.createdAt}
              likes={post.likes}
              comments={post.comments}
              shares={post.shares}
              daoMembers={post.daoMembers}
              hasJoined={joined}
            />
          ))}
        </div>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <InfoIcon className="h-5 w-5 text-primary" />
              About this DAO
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Description</div>
                <div className="text-sm">{daoData.description}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Type</div>
                <div>{daoData.type}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Founder</div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={daoData.founder.avatar} />
                    <AvatarFallback>{daoData.founder.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{daoData.founder.handle}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Voting Power</div>
                <div>{daoData.votingPower}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Members</div>
                <div className="text-xl font-semibold">{daoData.members}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Posts</div>
                <div className="text-xl font-semibold">{daoData.postsCount}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Proposals</div>
                <div className="text-xl font-semibold">{daoData.proposalsCount}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Treasury</div>
                <div className="text-xl font-semibold">{daoData.treasury}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Recent Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {daoData.membersList.map((member, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{member.handle}</div>
                      <div className="text-xs text-muted-foreground">{member.role}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Joined {member.joined}
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4" size="sm">
              View All Members
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DaoFeed;
