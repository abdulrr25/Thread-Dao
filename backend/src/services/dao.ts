import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { supabase } from '../lib/supabase';

export interface CreateDAOOptions {
  title: string;
  description: string;
  creator: string;
}

export interface DAO {
  address: string;
  title: string;
  description: string;
  creator: string;
  members: string[];
  created_at: string;
}

export async function createDAO(options: CreateDAOOptions): Promise<DAO> {
  const { data, error } = await supabase
    .from('daos')
    .insert({
      title: options.title,
      description: options.description,
      creator: options.creator,
      members: [options.creator],
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getDAO(address: string): Promise<DAO | null> {
  const { data, error } = await supabase
    .from('daos')
    .select('*')
    .eq('address', address)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

export async function addMember(address: string, walletAddress: string): Promise<void> {
  const { data: dao } = await supabase
    .from('daos')
    .select('members')
    .eq('address', address)
    .single();

  if (!dao) throw new Error('DAO not found');

  const updatedMembers = [...dao.members, walletAddress];

  const { error } = await supabase
    .from('daos')
    .update({ members: updatedMembers })
    .eq('address', address);

  if (error) throw error;
} 