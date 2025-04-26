export interface DaoMember {
    name: string;
    handle: string;
    avatar: string;
    role: string;
    joined: string;
  }
  
  export interface PostAuthor {
    name: string;
    handle: string;
    avatar: string;
  }
  
  export interface Post {
    id: string;
    author: PostAuthor;
    content: string;
    createdAt: string;
    likes: number;
    comments: number;
    shares: number;
    daoMembers: number;
    image?: string;
  }
  
  export interface DaoProposal {
    id: string;
    title: string;
    description: string;
    status: string;
    votes: { for: number; against: number };
    createdBy: string;
    created: string;
    ends: string;
  }
  
  export interface ActivityEvent {
    event: string;
    time: string;
    user?: string;
    amount?: string;
  }
  
  export interface DaoData {
    id: string;
    name: string;
    description: string;
    type: string;
    created: string;
    members: number;
    postsCount: number;
    proposalsCount: number;
    treasury: string;
    votingPower: string;
    links: {
      website: string;
      twitter: string;
      github: string;
    };
    founder: {
      name: string;
      handle: string;
      avatar: string;
    };
    activity: ActivityEvent[];
    posts: Post[];
    membersList: DaoMember[];
    proposals: DaoProposal[];
  }