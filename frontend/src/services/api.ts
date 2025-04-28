import axios from 'axios';
import { supabase } from '@/services/supabase';
import { Post, DaoData, DaoProposal } from '@/types/dao';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = {
  // User Profile
  getUserProfile: async (address: string): Promise<any> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_address', address)
      .single();

    if (error) throw error;
    return data;
  },

  createUserProfile: async (data: {
    wallet_address: string;
    username: string;
    bio: string;
    avatar: string;
  }): Promise<any> => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return profile;
  },

  updateUserProfile: async (address: string, data: {
    username: string;
    bio: string;
    avatar: string;
  }): Promise<any> => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('wallet_address', address)
      .select()
      .single();

    if (error) throw error;
    return profile;
  },

  // DAOs
  getUserDaos: async (address: string): Promise<DaoData[]> => {
    const { data, error } = await supabase
      .from('daos')
      .select('*')
      .eq('creator_address', address);

    if (error) throw error;
    return data;
  },

  getDao: async (id: string): Promise<DaoData> => {
    const { data, error } = await supabase
      .from('daos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  createDao: async (data: {
    name: string;
    description: string;
    creator_address: string;
    token_name: string;
    token_symbol: string;
  }): Promise<DaoData> => {
    const { data: dao, error } = await supabase
      .from('daos')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return dao;
  },

  updateDao: async (id: string, data: {
    name: string;
    description: string;
    image: string;
    tokenName: string;
    tokenSymbol: string;
  }): Promise<DaoData> => {
    const response = await axios.put(`${API_URL}/daos/${id}`, data);
    return response.data;
  },

  // Posts
  getDaoPosts: async (daoId: string): Promise<Post[]> => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('dao_id', daoId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  createPost: async (data: {
    dao_id: string;
    author_address: string;
    content: string;
    image?: string;
  }): Promise<Post> => {
    const { data: post, error } = await supabase
      .from('posts')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return post;
  },

  // Proposals
  getDaoProposals: async (daoId: string): Promise<DaoProposal[]> => {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('dao_id', daoId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Featured DAOs
  getFeaturedDaos: async (): Promise<DaoData[]> => {
    const { data, error } = await supabase
      .from('daos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) throw error;
    return data;
  },

  // Trending Posts
  getTrendingPosts: async (): Promise<Post[]> => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4);

    if (error) throw error;
    return data;
  }
}; 