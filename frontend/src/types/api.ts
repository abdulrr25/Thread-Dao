export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
}

export interface UserProfile {
  id: string;
  wallet_address: string;
  username: string;
  bio: string;
  avatar: string;
  created_at: string;
  updated_at: string;
}

export interface DaoData {
  id: string;
  name: string;
  description: string;
  creator_address: string;
  token_name: string;
  token_symbol: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  dao_id: string;
  author_address: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface DaoProposal {
  id: string;
  dao_id: string;
  title: string;
  description: string;
  proposer_address: string;
  status: 'active' | 'passed' | 'rejected';
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDaoRequest {
  name: string;
  description: string;
  token_name: string;
  token_symbol: string;
  image?: string;
}

export interface UpdateDaoRequest {
  name?: string;
  description?: string;
  token_name?: string;
  token_symbol?: string;
  image?: string;
}

export interface CreatePostRequest {
  dao_id: string;
  title: string;
  content: string;
}

export interface CreateProposalRequest {
  dao_id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
}

export interface UpdateProfileRequest {
  username?: string;
  bio?: string;
  avatar?: string;
} 