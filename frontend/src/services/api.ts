import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { supabase } from '@/services/supabase';
import { Post, DaoData, DaoProposal, UserProfile } from '@/types/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface ApiService {
  // DAO related
  getDao: (id: string) => Promise<ApiResponse<any>>;
  getMyDaos: () => Promise<ApiResponse<any[]>>;
  createDao: (data: any) => Promise<ApiResponse<any>>;
  getTrendingDaos: () => Promise<ApiResponse<any[]>>;
  
  // Activity related
  getRecentActivities: () => Promise<ApiResponse<any[]>>;
  
  // Post related
  getTrendingPosts: () => Promise<ApiResponse<any[]>>;
  createPost: (data: any) => Promise<ApiResponse<any>>;
}

class ApiServiceImpl implements ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // TODO: Implement token refresh logic
          return Promise.reject(error);
        }
        return Promise.reject(error);
      }
    );
  }

  private async request<T>(method: string, url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.api({
        method,
        url,
        data,
      });
      return { data: response.data };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        data: null as unknown as T,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // DAO related
  async getDao(id: string): Promise<ApiResponse<any>> {
    return this.request('GET', `/daos/${id}`);
  }

  async getMyDaos(): Promise<ApiResponse<any[]>> {
    return this.request('GET', '/daos/my');
  }

  async createDao(data: any): Promise<ApiResponse<any>> {
    return this.request('POST', '/daos', data);
  }

  async getTrendingDaos(): Promise<ApiResponse<any[]>> {
    return this.request('GET', '/daos/trending');
  }

  // Activity related
  async getRecentActivities(): Promise<ApiResponse<any[]>> {
    return this.request('GET', '/activities/recent');
  }

  // Post related
  async getTrendingPosts(): Promise<ApiResponse<any[]>> {
    return this.request('GET', '/posts/trending');
  }

  async createPost(data: any): Promise<ApiResponse<any>> {
    return this.request('POST', '/posts', data);
  }

  // User Profile
  async getUserProfile(address: string): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_address', address)
      .single();

    if (error) throw this.handleError(error);
    return data;
  }

  async createUserProfile(data: {
    wallet_address: string;
    username: string;
    bio: string;
    avatar: string;
  }): Promise<UserProfile> {
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert([data])
      .select()
      .single();

    if (error) throw this.handleError(error);
    return profile;
  }

  async updateUserProfile(address: string, data: {
    username: string;
    bio: string;
    avatar: string;
  }): Promise<any> {
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('wallet_address', address)
      .select()
      .single();

    if (error) throw error;
    return profile;
  }

  // DAOs
  async getUserDaos(address: string): Promise<DaoData[]> {
    const { data, error } = await supabase
      .from('daos')
      .select('*')
      .eq('creator_address', address);

    if (error) throw this.handleError(error);
    return data;
  }

  async updateDao(id: string, data: {
    name: string;
    description: string;
    image: string;
    tokenName: string;
    tokenSymbol: string;
  }): Promise<DaoData> {
    return this.put<DaoData>(`/daos/${id}`, data);
  }

  // Posts
  async getDaoPosts(daoId: string): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('dao_id', daoId)
      .order('created_at', { ascending: false });

    if (error) throw this.handleError(error);
    return data;
  }

  // Proposals
  async getDaoProposals(daoId: string): Promise<DaoProposal[]> {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('dao_id', daoId)
      .order('created_at', { ascending: false });

    if (error) throw this.handleError(error);
    return data;
  }

  // Featured DAOs
  async getFeaturedDaos(): Promise<DaoData[]> {
    const { data, error } = await supabase
      .from('daos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) throw this.handleError(error);
    return data;
  }
}

// Create and export a single instance
const apiService = new ApiServiceImpl();

// Export both the instance and the class for backward compatibility
export { apiService };
export const api = apiService; 