import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { supabase } from '@/services/supabase';
import { Post, DaoData, DaoProposal } from '@/types/dao';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.get<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.delete<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      console.error('API Error:', message);
    } else {
      console.error('Unknown Error:', error);
    }
  }

  // User Profile
  async getUserProfile(address: string): Promise<any> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_address', address)
      .single();

    if (error) throw error;
    return data;
  }

  async createUserProfile(data: {
    wallet_address: string;
    username: string;
    bio: string;
    avatar: string;
  }): Promise<any> {
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
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

    if (error) throw error;
    return data;
  }

  async getDao(id: string): Promise<DaoData> {
    const { data, error } = await supabase
      .from('daos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createDao(data: {
    name: string;
    description: string;
    creator_address: string;
    token_name: string;
    token_symbol: string;
  }): Promise<DaoData> {
    const { data: dao, error } = await supabase
      .from('daos')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return dao;
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

    if (error) throw error;
    return data;
  }

  async createPost(data: {
    dao_id: string;
    author_address: string;
    content: string;
    title: string;
  }): Promise<Post> {
    const { data: post, error } = await supabase
      .from('posts')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return post;
  }

  // Proposals
  async getDaoProposals(daoId: string): Promise<DaoProposal[]> {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('dao_id', daoId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Featured DAOs
  async getFeaturedDaos(): Promise<DaoData[]> {
    const { data, error } = await supabase
      .from('daos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) throw error;
    return data;
  }

  // Trending Posts
  async getTrendingPosts(): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4);

    if (error) throw error;
    return data;
  }
}

export const api = new ApiService(); 