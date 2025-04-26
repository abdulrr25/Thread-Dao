import express from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { createDAO, getDAO, addMember } from '../services/dao';

const router = express.Router();

// Schema for creating a DAO
const createDAOSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  creator: z.string().min(1),
});

// Schema for joining a DAO
const joinDAOSchema = z.object({
  walletAddress: z.string().min(1),
});

// Schema for creating a proposal
const createProposalSchema = z.object({
  proposal: z.string().min(1),
  proposer: z.string().min(1),
});

// Schema for voting on a proposal
const voteSchema = z.object({
  voter: z.string().min(1),
  vote: z.enum(['yes', 'no']),
});

// Schema for member management
const memberManagementSchema = z.object({
  walletAddress: z.string().min(1),
  action: z.enum(['invite', 'remove']),
});

// Get all DAOs
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('daos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ data });
  } catch (error) {
    console.error('Error fetching DAOs:', error);
    res.status(500).json({ error: 'Failed to fetch DAOs' });
  }
});

// Create a new DAO
router.post('/', async (req, res) => {
  try {
    const { title, description, creator } = createDAOSchema.parse(req.body);

    const dao = await createDAO({
      title,
      description,
      creator,
    });

    res.json(dao);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error creating DAO:', error);
      res.status(500).json({ error: 'Failed to create DAO' });
    }
  }
});

// Get a specific DAO
router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params;
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
router.post('/:address/join', async (req, res) => {
  try {
    const { address } = req.params;
    const { walletAddress } = joinDAOSchema.parse(req.body);

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
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error joining DAO:', error);
      res.status(500).json({ error: 'Failed to join DAO' });
    }
  }
});

// Manage DAO members
router.post('/:address/members', async (req, res) => {
  try {
    const { address } = req.params;
    const { walletAddress, action } = memberManagementSchema.parse(req.body);

    const dao = await getDAO(address);
    if (!dao) {
      return res.status(404).json({ error: 'DAO not found' });
    }

    // Only the creator can manage members
    if (req.body.requester !== dao.creator) {
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

      if (error) throw error;
    }

    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error managing members:', error);
      res.status(500).json({ error: 'Failed to manage members' });
    }
  }
});

// Create a proposal
router.post('/:address/proposals', async (req, res) => {
  try {
    const { address } = req.params;
    const { proposal, proposer } = createProposalSchema.parse(req.body);

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

    if (error) throw error;

    res.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error creating proposal:', error);
      res.status(500).json({ error: 'Failed to create proposal' });
    }
  }
});

// Get proposals for a DAO
router.get('/:address/proposals', async (req, res) => {
  try {
    const { address } = req.params;

    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('dao_address', address)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

// Vote on a proposal
router.post('/:address/proposals/:proposalId/vote', async (req, res) => {
  try {
    const { address, proposalId } = req.params;
    const { voter, vote } = voteSchema.parse(req.body);

    // Check if DAO exists
    const dao = await getDAO(address);
    if (!dao) {
      return res.status(404).json({ error: 'DAO not found' });
    }

    // Check if voter is a member
    if (!dao.members.includes(voter)) {
      return res.status(403).json({ error: 'Not a member of this DAO' });
    }

    // Get the proposal
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', proposalId)
      .eq('dao_address', address)
      .single();

    if (proposalError) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    // Check if proposal is still pending
    if (proposal.status !== 'pending') {
      return res.status(400).json({ error: 'Proposal is no longer open for voting' });
    }

    // Check if voter has already voted
    const hasVoted = proposal.votes.some((v: any) => v.voter === voter);
    if (hasVoted) {
      return res.status(400).json({ error: 'Already voted on this proposal' });
    }

    // Add the vote
    const updatedVotes = [...proposal.votes, { voter, vote }];
    
    // Update the proposal
    const { data: updatedProposal, error: updateError } = await supabase
      .from('proposals')
      .update({ votes: updatedVotes })
      .eq('id', proposalId)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json(updatedProposal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error voting on proposal:', error);
      res.status(500).json({ error: 'Failed to vote on proposal' });
    }
  }
});

export default router; 