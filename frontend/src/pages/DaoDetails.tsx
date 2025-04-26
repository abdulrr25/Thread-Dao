import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DaoHeader from '@/components/dao/DaoHeader';
import DaoFeed from '@/components/dao/DaoFeed';
import { DaoData } from '@/types/dao';
import DaoGovernance from '@/components/dao/DaoGovernance';
import DaoTreasury from '@/components/dao/DaoTreasury';
import DaoActivity from '@/components/dao/DaoActivity';
import DaoSettings from '@/components/dao/DaoSettings';
import DaoMembers from '@/components/dao/DaoMember';

const DaoDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [joined, setJoined] = useState(false);
  
  // This would come from your API based on the ID
  const daoData: DaoData = {
    id: id || '1',
    name: 'CreatorDAO',
    description: 'A community for content creators exploring web3 and decentralized social platforms. Join us to collaborate, learn and build the future of digital ownership.',
    type: 'Social',
    created: '3 months ago',
    members: 234,
    postsCount: 78,
    proposalsCount: 12,
    treasury: '2.5 ETH',
    votingPower: 'Token Based',
    links: {
      website: 'https://creatordao.eth',
      twitter: 'https://twitter.com/creatordao',
      github: 'https://github.com/creatordao'
    },
    founder: {
      name: 'Alex Rodriguez',
      handle: 'alexr.eth',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    activity: [
      { event: 'New member joined', time: '2 hours ago', user: 'web3dev.eth' },
      { event: 'New proposal created', time: '1 day ago', user: 'nftcollector.eth' },
      { event: 'Treasury received funds', time: '3 days ago', amount: '0.5 ETH' }
    ],
    posts: [
      {
        id: '1',
        author: {
          name: 'Alex Rodriguez',
          handle: 'alexr.eth',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        content: "Welcome to CreatorDAO! We're building a space for content creators to explore the possibilities of web3 and decentralized ownership.",
        createdAt: '3 days ago',
        likes: 24,
        comments: 8,
        shares: 5,
        daoMembers: 234
      },
      {
        id: '2',
        author: {
          name: 'Sarah Chen',
          handle: 'sarahc',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        content: "Just joined CreatorDAO and excited to collaborate with everyone! I've been creating digital art for 5 years and looking to explore NFTs.",
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29kZXxlbnwwfHwwfHx8MA%3D%3D',
        createdAt: '2 days ago',
        likes: 18,
        comments: 4,
        shares: 2,
        daoMembers: 234
      }
    ],
    membersList: [
      { 
        name: 'Alex Rodriguez', 
        handle: 'alexr.eth', 
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        role: 'Founder',
        joined: '3 months ago'
      },
      { 
        name: 'Sarah Chen', 
        handle: 'sarahc', 
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        role: 'Member',
        joined: '2 days ago'
      },
      { 
        name: 'Michael Johnson', 
        handle: 'mikej.eth', 
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        role: 'Contributor',
        joined: '1 month ago'
      }
    ],
    proposals: [
      {
        id: '1',
        title: 'Add NFT Creation Tools',
        description: 'Proposal to integrate NFT creation tools directly into the DAO platform.',
        status: 'Active',
        votes: { for: 65, against: 10 },
        createdBy: 'alexr.eth',
        created: '3 days ago',
        ends: '4 days left'
      },
      {
        id: '2',
        title: 'Community Funding Round',
        description: 'Allocate 1 ETH for community projects and initiatives.',
        status: 'Passed',
        votes: { for: 82, against: 5 },
        createdBy: 'mikej.eth',
        created: '2 weeks ago',
        ends: 'Ended'
      }
    ]
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePage="my-daos" />
      
      <main className="flex-1 border-l border-muted/30">
        <DaoHeader 
          daoData={daoData}
          joined={joined}
          onJoinClick={() => setJoined(!joined)}
        />
        
        <div className="container max-w-6xl py-6 px-4 md:px-6">
          <Tabs defaultValue="feed">
            <TabsList className="w-full grid grid-cols-6 mb-6">
              <TabsTrigger value="feed">Feed</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="governance">Governance</TabsTrigger>
              <TabsTrigger value="treasury">Treasury</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="feed">
              <DaoFeed daoData={daoData} joined={joined} />
            </TabsContent>
            
            <TabsContent value="members">
              <DaoMembers members={daoData.membersList} totalMembers={daoData.members} />
            </TabsContent>
            
            <TabsContent value="governance">
              <DaoGovernance proposals={daoData.proposals} votingPower={daoData.votingPower} proposalsCount={daoData.proposalsCount} />
            </TabsContent>
            
            <TabsContent value="treasury">
              <DaoTreasury treasury={daoData.treasury} />
            </TabsContent>
            
            <TabsContent value="activity">
              <DaoActivity activity={daoData.activity} />
            </TabsContent>
            
            <TabsContent value="settings">
              <DaoSettings daoData={daoData} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default DaoDetails;