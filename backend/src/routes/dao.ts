import express, { Router } from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { createDAO, getDAO, addMember } from '../services/dao';
import { rateLimitMiddleware } from '../middleware/rateLimit.js';
import { validateRequest } from '../middleware/validateRequest';
import { authenticateUser } from '../middleware/auth.js';
import { sanitizeInput } from '../middleware/sanitizeInput';
import { AuthenticatedRequest } from '../types/express.js';

const router = Router();

// Schema for creating a DAO
const createDAOSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  creator: z.string().min(1).max(44),
});

// Schema for joining a DAO
const joinDAOSchema = z.object({
  walletAddress: z.string().min(32).max(44),
});

// Schema for creating a proposal
const createProposalSchema = z.object({
  proposal: z.string().min(10).max(1000),
  proposer: z.string().min(32).max(44),
});

// Schema for voting on a proposal
const voteSchema = z.object({
  voter: z.string().min(32).max(44),
  vote: z.enum(['yes', 'no']),
});

// Schema for member management
const memberManagementSchema = z.object({
  walletAddress: z.string().min(32).max(44),
  action: z.enum(['invite', 'remove']),
});

// Apply rate limiting to all routes
router.use(rateLimitMiddleware);

// Apply authentication to all routes
router.use(authenticateUser);

// Get all DAOs
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('daos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch DAOs' });
    }

    res.json({ data });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// Create a new DAO
router.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    const { name, description } = req.body;
    const creator = req.user.walletAddress;

    const dao = await createDAO({
      title: name,
      description,
      creator,
    });

    res.json(dao);
  } catch (error) {
    console.error('Error creating DAO:', error);
    res.status(500).json({ error: 'Failed to create DAO' });
  }
});

// Get a specific DAO
router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    // Validate address format
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
      return res.status(400).json({ error: 'Invalid DAO address format' });
    }

    const dao = await getDAO(address);

    if (!dao) {
      return res.status(404).json({ error: 'DAO not found' });
    }

    res.json(dao);
  } catch (error) {
    console.error('Error fetching DAO:', error);
    res.status(500).json({ error: 'Failed to fetch DAO' });
  }
});

// Join a DAO
router.post('/:address/join', async (req: AuthenticatedRequest, res) => {
  try {
    const { address } = req.params;
    const { walletAddress } = req.body;

    if (walletAddress !== req.user.walletAddress) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const dao = await getDAO(address);
    if (!dao) {
      return res.status(404).json({ error: 'DAO not found' });
    }

    if (dao.members.includes(walletAddress)) {
      return res.status(400).json({ error: 'Already a member' });
    }

    await addMember(address, walletAddress);
    res.json({ success: true });
  } catch (error) {
    console.error('Error joining DAO:', error);
    res.status(500).json({ error: 'Failed to join DAO' });
  }
});

// Manage DAO members
router.post('/:address/members', async (req: AuthenticatedRequest, res) => {
  try {
    const { address } = req.params;
    const { walletAddress, action } = req.body;

    const dao = await getDAO(address);
    if (!dao) {
      return res.status(404).json({ error: 'DAO not found' });
    }

    if (req.user.walletAddress !== dao.creator) {
      return res.status(403).json({ error: 'Only the DAO creator can manage members' });
    }

    if (action === 'invite') {
      if (dao.members.includes(walletAddress)) {
        return res.status(400).json({ error: 'Already a member' });
      }
      await addMember(address, walletAddress);
    } else if (action === 'remove') {
      if (!dao.members.includes(walletAddress)) {
        return res.status(400).json({ error: 'Not a member' });
      }
      if (walletAddress === dao.creator) {
        return res.status(400).json({ error: 'Cannot remove the DAO creator' });
      }

      const updatedMembers = dao.members.filter(member => member !== walletAddress);
      const { error } = await supabase
        .from('daos')
        .update({ members: updatedMembers })
        .eq('address', address);

      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to remove member' });
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error managing members:', error);
    res.status(500).json({ error: 'Failed to manage members' });
  }
});

// Create a proposal
router.post('/:address/proposals', async (req: AuthenticatedRequest, res) => {
  try {
    const { address } = req.params;
    const { proposal, proposer } = req.body;

    if (proposer !== req.user.walletAddress) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const dao = await getDAO(address);
    if (!dao) {
      return res.status(404).json({ error: 'DAO not found' });
    }

    if (!dao.members.includes(proposer)) {
      return res.status(403).json({ error: 'Not a member of this DAO' });
    }

    const { data, error } = await supabase
      .from('proposals')
      .insert({
        dao_address: address,
        proposal,
        proposer,
        status: 'pending',
        votes: [],
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to create proposal' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error creating proposal:', error);
    res.status(500).json({ error: 'Failed to create proposal' });
  }
});

// Get proposals for a DAO
router.get('/:address/proposals', async (req, res) => {
  try {
    const { address } = req.params;

    // Validate address format
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
      return res.status(400).json({ error: 'Invalid DAO address format' });
    }

    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('dao_address', address)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch proposals' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

// Vote on a proposal
router.post('/:address/proposals/:proposalId/vote', async (req: AuthenticatedRequest, res) => {
  try {
    const { address, proposalId } = req.params;
    const { voter, vote } = req.body;

    if (voter !== req.user.walletAddress) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const dao = await getDAO(address);
    if (!dao) {
      return res.status(404).json({ error: 'DAO not found' });
    }

    if (!dao.members.includes(voter)) {
      return res.status(403).json({ error: 'Not a member of this DAO' });
    }

    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', proposalId)
      .single();

    if (proposalError) {
      console.error('Database error:', proposalError);
      return res.status(500).json({ error: 'Failed to fetch proposal' });
    }

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    if (proposal.dao_address !== address) {
      return res.status(400).json({ error: 'Invalid proposal for this DAO' });
    }

    if (proposal.votes.some((v: any) => v.voter === voter)) {
      return res.status(400).json({ error: 'Already voted on this proposal' });
    }

    const updatedVotes = [...proposal.votes, { voter, vote }];
    const { error: updateError } = await supabase
      .from('proposals')
      .update({ votes: updatedVotes })
      .eq('id', proposalId);

    if (updateError) {
      console.error('Database error:', updateError);
      return res.status(500).json({ error: 'Failed to record vote' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error voting on proposal:', error);
    res.status(500).json({ error: 'Failed to vote on proposal' });
  }
});

export default router; 