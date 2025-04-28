import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Profile Management
export const profileService = {
  async getProfile(walletAddress: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProfile(walletAddress: string, profileData: any) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        wallet_address: walletAddress,
        ...profileData,
        updated_at: new Date().toISOString(),
      });
    
    if (error) throw error;
    return data;
  },
};

// DAO Management
export const daoService = {
  async getDAOs() {
    const { data, error } = await supabase
      .from('daos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getDAO(id: string) {
    const { data, error } = await supabase
      .from('daos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createDAO(daoData: any) {
    const { data, error } = await supabase
      .from('daos')
      .insert([daoData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
};

// Post Management
export const postService = {
  async getPosts(daoId: string) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('dao_id', daoId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createPost(postData: any) {
    const { data, error } = await supabase
      .from('posts')
      .insert([postData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
};

// Proposal Management
export const proposalService = {
  async getProposals(daoId: string) {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('dao_id', daoId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createProposal(proposalData: any) {
    const { data, error } = await supabase
      .from('proposals')
      .insert([proposalData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
};

// Founder Matching
export const founderService = {
  async getFounderProfiles() {
    const { data, error } = await supabase
      .from('founder_profiles')
      .select('*');
    
    if (error) throw error;
    return data;
  },

  async updateFounderProfile(walletAddress: string, profileData: any) {
    const { data, error } = await supabase
      .from('founder_profiles')
      .upsert({
        wallet_address: walletAddress,
        ...profileData,
        updated_at: new Date().toISOString(),
      });
    
    if (error) throw error;
    return data;
  },
};

// Chat Management
export const chatService = {
  async getMessages(daoId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('dao_id', daoId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async sendMessage(messageData: any) {
    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select();
    
    if (error) throw error;
    return data[0];
  },
}; 