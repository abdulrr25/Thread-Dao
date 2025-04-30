export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Dao {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  banner?: string;
  ownerId: string;
  owner: User;
  members: Member[];
  proposals: Proposal[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Member {
  id: string;
  userId: string;
  user: User;
  daoId: string;
  dao: Dao;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date;
  updatedAt: Date;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  daoId: string;
  dao: Dao;
  authorId: string;
  author: User;
  status: 'draft' | 'active' | 'passed' | 'rejected' | 'expired';
  type: 'general' | 'funding' | 'governance';
  startDate: Date;
  endDate: Date;
  votes: Vote[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Vote {
  id: string;
  proposalId: string;
  proposal: Proposal;
  userId: string;
  user: User;
  vote: 'yes' | 'no' | 'abstain';
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: User;
  proposalId: string;
  proposal: Proposal;
  parentId?: string;
  parent?: Comment;
  replies: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  user: User;
  type: 'proposal' | 'vote' | 'comment' | 'member';
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, any>;
} 