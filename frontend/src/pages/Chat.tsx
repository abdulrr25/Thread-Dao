import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { 
  Users, ArrowLeft,  Send, Image, 
  Sparkles, Info, FileVideo, PlusCircle 
} from 'lucide-react';

// Types for chat messages
interface ChatUser {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  isOnline?: boolean;
}

interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  user: ChatUser;
  isOwn?: boolean;
  image?: string;
}

// Mock data for the chat
const mockChat = {
  id: '1',
  name: 'CreatorDAO',
  description: 'A community for content creators exploring web3 and decentralized social platforms.',
  members: [
    { 
      id: '1', 
      name: 'Alex Rodriguez', 
      handle: 'alexr.eth', 
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      isOnline: true
    },
    { 
      id: '2', 
      name: 'Sarah Chen', 
      handle: 'sarahc', 
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      isOnline: true
    },
    { 
      id: '3', 
      name: 'Michael Johnson', 
      handle: 'mikej.eth', 
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      isOnline: false
    },
    { 
      id: '4', 
      name: 'Emily Wong', 
      handle: 'emilyw', 
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      isOnline: true
    },
    { 
      id: '5', 
      name: 'David Kim', 
      handle: 'davidk.eth', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      isOnline: false
    }
  ],
  messages: [
    {
      id: '1',
      content: 'Welcome everyone to the CreatorDAO chat! This is where we can discuss ideas, share updates, and collaborate on projects.',
      timestamp: '2 days ago',
      user: { 
        id: '1', 
        name: 'Alex Rodriguez', 
        handle: 'alexr.eth', 
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' 
      }
    },
    {
      id: '2',
      content: "Thanks for setting this up! I'm excited to be part of this DAO and looking forward to working with everyone.",
      timestamp: '2 days ago',
      user: { 
        id: '2', 
        name: 'Sarah Chen', 
        handle: 'sarahc', 
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' 
      }
    },
    {
      id: '3',
      content: "Hey everyone! I'm Michael, a web3 developer. Looking forward to contributing to the DAO's technical projects.",
      timestamp: '1 day ago',
      user: { 
        id: '3', 
        name: 'Michael Johnson', 
        handle: 'mikej.eth', 
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' 
      }
    },
    {
      id: '4',
      content: 'I just submitted a new proposal for the DAO to fund a community-created NFT collection. Please check it out when you have time!',
      timestamp: '1 day ago',
      user: { 
        id: '2', 
        name: 'Sarah Chen', 
        handle: 'sarahc', 
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' 
      }
    },
    {
      id: '5',
      content: "Here's a preview of what the collection might look like:",
      timestamp: '1 day ago',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29kZXxlbnwwfHwwfHx8MA%3D%3D',
      user: { 
        id: '2', 
        name: 'Sarah Chen', 
        handle: 'sarahc', 
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' 
      }
    },
    {
      id: '6',
      content: "That looks amazing, Sarah! I'll review the proposal today.",
      timestamp: '12 hours ago',
      user: { 
        id: '1', 
        name: 'Alex Rodriguez', 
        handle: 'alexr.eth', 
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' 
      }
    },
    {
      id: '7',
      content: "Just want to let everyone know that I've deployed the new smart contract for our governance system. You can find the details in the #development channel on Discord.",
      timestamp: '6 hours ago',
      user: { 
        id: '3', 
        name: 'Michael Johnson', 
        handle: 'mikej.eth', 
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' 
      }
    },
    {
      id: '8',
      content: 'Great work, Michael! This will really streamline our decision-making process.',
      timestamp: '3 hours ago',
      user: { 
        id: '1', 
        name: 'Alex Rodriguez', 
        handle: 'alexr.eth', 
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' 
      }
    }
  ]
};

const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(mockChat.messages);
  const [showMembers, setShowMembers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Simulating own user
  const ownUser: ChatUser = { 
    id: '1', 
    name: 'Alex Rodriguez', 
    handle: 'alexr.eth', 
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' 
  };
  
  // Process messages to mark own messages
  useEffect(() => {
    const processedMessages = mockChat.messages.map(msg => ({
      ...msg,
      isOwn: msg.user.id === ownUser.id
    }));
    setMessages(processedMessages);
  }, []);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: ChatMessage = {
      id: String(Date.now()),
      content: message,
      timestamp: 'Just now',
      user: ownUser,
      isOwn: true
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePage="my-daos" />
      
      <main className="flex-1 flex flex-col border-l border-muted/30">
        <header className="py-3 px-4 border-b border-muted/30 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/dao/${id}`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-thread-gradient flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="font-semibold">
                  <Link to={`/dao/${id}`} className="hover:text-primary transition-colors">
                    {mockChat.name}
                  </Link>
                </h1>
                <div className="text-xs text-muted-foreground">
                  {mockChat.members.filter(m => m.isOnline).length} online • {mockChat.members.length} members
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className={showMembers ? 'bg-muted' : ''}
              onClick={() => setShowMembers(!showMembers)}
            >
              <Users className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/dao/${id}`}>
                <Info className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </header>
        
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 ${msg.isOwn ? 'justify-end' : ''}`}
                >
                  {!msg.isOwn && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src={msg.user.avatar} alt={msg.user.name} />
                      <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[70%] ${msg.isOwn ? 'items-end' : ''} flex flex-col`}>
                    {!msg.isOwn && (
                      <div className="text-sm font-medium mb-1">{msg.user.handle}</div>
                    )}
                    
                    <div className={`${msg.isOwn 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'} rounded-lg px-3 py-2 break-words`}
                    >
                      <p>{msg.content}</p>
                      
                      {msg.image && (
                        <div className="mt-2 rounded-md overflow-hidden">
                          <img 
                            src={msg.image} 
                            alt="Shared content" 
                            className="max-w-full h-auto"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-muted-foreground mt-1">{msg.timestamp}</div>
                  </div>
                  
                  {msg.isOwn && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src={msg.user.avatar} alt={msg.user.name} />
                      <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t border-muted/30">
              <div className="flex gap-3 items-center">
                <Input 
                  placeholder="Type a message..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                
                <Button variant="ghost" size="icon">
                  <Image className="h-5 w-5 text-muted-foreground" />
                </Button>
                
                <Button variant="ghost" size="icon">
                  <FileVideo className="h-5 w-5 text-muted-foreground" />
                </Button>
                
                <Button 
                  disabled={!message.trim()}
                  onClick={handleSendMessage}
                  className="bg-thread-gradient hover:opacity-90"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </div>
          
          {showMembers && (
            <div className="w-64 border-l border-muted/30 p-4 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Members</h3>
                <span className="text-xs text-muted-foreground">{mockChat.members.length}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-2">
                  {mockChat.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {member.isOnline && (
                          <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background"></div>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-medium text-sm truncate">{member.handle}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {member.id === '1' ? 'Founder' : 'Member'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Card className="mt-4">
                <CardContent className="p-3">
                  <Button variant="outline" size="sm" className="w-full">
                    <PlusCircle className="h-3.5 w-3.5 mr-1" />
                    Invite Members
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Chat;