import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Loading } from '@/components/ui/loading';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import ThreadPost from '@/components/ThreadPost';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, BarChart2 } from 'lucide-react';

const DAO: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: dao, isLoading } = useQuery({
    queryKey: ['dao', id],
    queryFn: () => api.getDao(id!),
    enabled: !!id,
  });

  const { data: posts } = useQuery({
    queryKey: ['dao-posts', id],
    queryFn: () => api.getDaoPosts(id!),
    enabled: !!id,
  });

  const { data: proposals } = useQuery({
    queryKey: ['dao-proposals', id],
    queryFn: () => api.getDaoProposals(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <Loading text="Loading DAO..." />;
  }

  if (!dao) {
    return <div>DAO not found</div>;
  }

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{dao.name}</h1>
            <p className="mt-2 text-muted-foreground">{dao.description}</p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {dao.members} Members
          </Badge>
        </div>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            <div className="space-y-6">
              {posts?.map((post) => (
                <ThreadPost key={post.id} post={post} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="proposals" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {proposals?.map((proposal) => (
                <Card key={proposal.id}>
                  <CardHeader>
                    <CardTitle>{proposal.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Status: {proposal.status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart2 className="h-4 w-4" />
                        <span>
                          {proposal.votes.for} / {proposal.votes.against}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="members" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {dao.membersList?.map((member) => (
                <Card key={member.address}>
                  <CardHeader>
                    <CardTitle>{member.username}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Role: {member.role}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
};

export default DAO; 