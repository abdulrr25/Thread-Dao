import { Request, Response } from 'express';
import { supabase } from '../services/supabase';
import { ethers } from 'ethers';
import { DAOContract } from '../contracts/DAOContract';

interface ProposalRequest extends Request {
  user?: {
    address: string;
    role: string;
  };
}

export const proposalController = {
  // Create a new proposal
  async createProposal(req: ProposalRequest, res: Response) {
    try {
      const { daoId, title, description, type, options } = req.body;
      const creatorAddress = req.user?.address;

      if (!creatorAddress) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Verify user is a member of the DAO
      const { data: membership, error: membershipError } = await supabase
        .from('dao_members')
        .select('*')
        .eq('dao_id', daoId)
        .eq('member_address', creatorAddress)
        .single();

      if (membershipError || !membership) {
        return res.status(403).json({ error: 'Not a member of this DAO' });
      }

      // Create proposal in database
      const { data: proposal, error } = await supabase
        .from('proposals')
        .insert([{
          dao_id: daoId,
          creator_address: creatorAddress,
          title,
          description,
          type,
          options,
          status: 'active',
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: 'Failed to create proposal' });
      }

      // Create proposal on-chain
      const daoContract = new DAOContract(daoId);
      await daoContract.createProposal(
        title,
        description,
        options.map((opt: string) => ethers.utils.formatBytes32String(opt))
      );

      res.status(201).json({ data: proposal });
    } catch (error) {
      console.error('Create proposal error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get proposals for a DAO
  async getProposals(req: Request, res: Response) {
    try {
      const { daoId } = req.params;
      const { status, type } = req.query;

      let query = supabase
        .from('proposals')
        .select(`
          *,
          creator:profiles!creator_address(*),
          votes:proposal_votes(*)
        `)
        .eq('dao_id', daoId);

      if (status) {
        query = query.eq('status', status);
      }

      if (type) {
        query = query.eq('type', type);
      }

      const { data: proposals, error } = await query
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: 'Failed to fetch proposals' });
      }

      res.json({ data: proposals });
    } catch (error) {
      console.error('Get proposals error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Vote on a proposal
  async vote(req: ProposalRequest, res: Response) {
    try {
      const { proposalId } = req.params;
      const { option } = req.body;
      const voterAddress = req.user?.address;

      if (!voterAddress) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Get proposal details
      const { data: proposal, error: proposalError } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', proposalId)
        .single();

      if (proposalError || !proposal) {
        return res.status(404).json({ error: 'Proposal not found' });
      }

      // Check if proposal is still active
      if (proposal.status !== 'active') {
        return res.status(400).json({ error: 'Proposal is not active' });
      }

      // Check if user has already voted
      const { data: existingVote, error: voteError } = await supabase
        .from('proposal_votes')
        .select('*')
        .eq('proposal_id', proposalId)
        .eq('voter_address', voterAddress)
        .single();

      if (existingVote) {
        return res.status(400).json({ error: 'Already voted on this proposal' });
      }

      // Record vote in database
      const { data: vote, error: createVoteError } = await supabase
        .from('proposal_votes')
        .insert([{
          proposal_id: proposalId,
          voter_address: voterAddress,
          option,
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (createVoteError) {
        return res.status(500).json({ error: 'Failed to record vote' });
      }

      // Submit vote on-chain
      const daoContract = new DAOContract(proposal.dao_id);
      await daoContract.vote(
        proposalId,
        ethers.utils.formatBytes32String(option)
      );

      res.status(201).json({ data: vote });
    } catch (error) {
      console.error('Vote error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Execute a proposal
  async executeProposal(req: ProposalRequest, res: Response) {
    try {
      const { proposalId } = req.params;
      const executorAddress = req.user?.address;

      if (!executorAddress) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Get proposal details
      const { data: proposal, error: proposalError } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', proposalId)
        .single();

      if (proposalError || !proposal) {
        return res.status(404).json({ error: 'Proposal not found' });
      }

      // Check if proposal has passed
      if (proposal.status !== 'passed') {
        return res.status(400).json({ error: 'Proposal has not passed' });
      }

      // Execute proposal on-chain
      const daoContract = new DAOContract(proposal.dao_id);
      await daoContract.executeProposal(proposalId);

      // Update proposal status
      const { data: updatedProposal, error: updateError } = await supabase
        .from('proposals')
        .update({ status: 'executed' })
        .eq('id', proposalId)
        .select()
        .single();

      if (updateError) {
        return res.status(500).json({ error: 'Failed to update proposal status' });
      }

      res.json({ data: updatedProposal });
    } catch (error) {
      console.error('Execute proposal error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
}; 