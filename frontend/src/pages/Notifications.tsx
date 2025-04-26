import React from 'react';
import Sidebar from '@/components/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import NotificationItem from '@/components/NotificationItem';

interface Notification {
  id: string;
  type: 'dao_join' | 'comment' | 'vote' | 'mention' | 'dao_action';
  title: string;
  content: string;
  time: string;
  read: boolean;
}

const Notifications: React.FC = () => {
  const allNotifications: Notification[] = [
    {
      id: '1',
      type: 'dao_join',
      title: 'Someone joined your DAO',
      content: 'Alex.eth joined your CreatorDAO',
      time: '2 minutes ago',
      read: false
    },
    {
      id: '2',
      type: 'comment',
      title: 'New comment on your post',
      content: 'Web3Girl commented: "This is amazing!"',
      time: '15 minutes ago',
      read: false
    },
    {
      id: '3',
      type: 'vote',
      title: 'New proposal vote',
      content: 'Your proposal "Add new feature" received 5 new votes',
      time: '1 hour ago',
      read: true
    },
    {
      id: '4',
      type: 'mention',
      title: 'Mention in a post',
      content: 'CryptoWhale mentioned you in "Future of DeFi" post',
      time: '3 hours ago',
      read: true
    },
    {
      id: '5',
      type: 'dao_action',
      title: 'DAO treasury update',
      content: 'NFTCollector.eth contributed 0.5 ETH to CreatorDAO',
      time: '5 hours ago',
      read: true
    }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePage="notifications" />
      
      <main className="flex-1 border-l border-muted/30">
        <div className="container max-w-4xl py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-muted-foreground">Stay updated on your DAOs and interactions</p>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList className="w-full mb-6 grid grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="mentions">Mentions</TabsTrigger>
              <TabsTrigger value="dao">DAO Activity</TabsTrigger>
              <TabsTrigger value="interactions">Interactions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-1">
                  {allNotifications.map(notification => (
                    <NotificationItem 
                      key={notification.id}
                      id={notification.id}
                      type={notification.type}
                      title={notification.title}
                      content={notification.content}
                      time={notification.time}
                      read={notification.read}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="mentions">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-1">
                  {allNotifications
                    .filter(n => n.type === 'mention')
                    .map(notification => (
                      <NotificationItem 
                        key={notification.id}
                        id={notification.id}
                        type={notification.type}
                        title={notification.title}
                        content={notification.content}
                        time={notification.time}
                        read={notification.read}
                      />
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="dao">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-1">
                  {allNotifications
                    .filter(n => n.type === 'dao_join' || n.type === 'dao_action' || n.type === 'vote')
                    .map(notification => (
                      <NotificationItem 
                        key={notification.id}
                        id={notification.id}
                        type={notification.type}
                        title={notification.title}
                        content={notification.content}
                        time={notification.time}
                        read={notification.read}
                      />
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="interactions">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-1">
                  {allNotifications
                    .filter(n => n.type === 'comment')
                    .map(notification => (
                      <NotificationItem 
                        key={notification.id}
                        id={notification.id}
                        type={notification.type}
                        title={notification.title}
                        content={notification.content}
                        time={notification.time}
                        read={notification.read}
                      />
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
