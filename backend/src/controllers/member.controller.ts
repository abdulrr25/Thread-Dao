import { Request, Response } from 'express';
import { supabase } from '../services/supabase';
import { ethers } from 'ethers';
import { DAOContract } from '../contracts/DAOContract';

interface MemberRequest extends Request {
  user?: {
    address: string;
    role: string;
  };
}

export const memberController = {
  // Join a DAO
  async joinDao(req: MemberRequest, res: Response) {
    try {
      const { daoId } = req.params;
      const memberAddress = req.user?.address;

      if (!memberAddress) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Check if DAO exists
      const { data: dao, error: daoError } = await supabase
        .from('daos')
        .select('*')
        .eq('id', daoId)
        .single();

      if (daoError || !dao) {
        return res.status(404).json({ error: 'DAO not found' });
      }

      // Check if user is already a member
      const { data: existingMember, error: memberError } = await supabase
        .from('dao_members')
        .select('*')
        .eq('dao_id', daoId)
        .eq('member_address', memberAddress)
        .single();

      if (existingMember) {
        return res.status(400).json({ error: 'Already a member of this DAO' });
      }

      // Join DAO on-chain
      const daoContract = new DAOContract(daoId);
      await daoContract.join(memberAddress);

      // Record membership in database
      const { data: membership, error: joinError } = await supabase
        .from('dao_members')
        .insert([{
          dao_id: daoId,
          member_address: memberAddress,
          role: 'member',
          joined_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (joinError) {
        return res.status(500).json({ error: 'Failed to record membership' });
      }

      res.status(201).json({ data: membership });
    } catch (error) {
      console.error('Join DAO error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Leave a DAO
  async leaveDao(req: MemberRequest, res: Response) {
    try {
      const { daoId } = req.params;
      const memberAddress = req.user?.address;

      if (!memberAddress) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Check if user is a member
      const { data: membership, error: memberError } = await supabase
        .from('dao_members')
        .select('*')
        .eq('dao_id', daoId)
        .eq('member_address', memberAddress)
        .single();

      if (memberError || !membership) {
        return res.status(404).json({ error: 'Not a member of this DAO' });
      }

      // Check if user is the creator
      const { data: dao, error: daoError } = await supabase
        .from('daos')
        .select('*')
        .eq('id', daoId)
        .single();

      if (daoError || !dao) {
        return res.status(404).json({ error: 'DAO not found' });
      }

      if (dao.creator_address === memberAddress) {
        return res.status(400).json({ error: 'DAO creator cannot leave' });
      }

      // Leave DAO on-chain
      const daoContract = new DAOContract(daoId);
      await daoContract.leave(memberAddress);

      // Remove membership from database
      const { error: leaveError } = await supabase
        .from('dao_members')
        .delete()
        .eq('dao_id', daoId)
        .eq('member_address', memberAddress);

      if (leaveError) {
        return res.status(500).json({ error: 'Failed to remove membership' });
      }

      res.json({ data: { message: 'Successfully left DAO' } });
    } catch (error) {
      console.error('Leave DAO error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update member role
  async updateMemberRole(req: MemberRequest, res: Response) {
    try {
      const { daoId, memberAddress } = req.params;
      const { role } = req.body;
      const updaterAddress = req.user?.address;

      if (!updaterAddress) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Check if updater has permission
      const { data: dao, error: daoError } = await supabase
        .from('daos')
        .select('*')
        .eq('id', daoId)
        .single();

      if (daoError || !dao) {
        return res.status(404).json({ error: 'DAO not found' });
      }

      if (dao.creator_address !== updaterAddress && req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to update roles' });
      }

      // Update role in database
      const { data: updatedMember, error: updateError } = await supabase
        .from('dao_members')
        .update({ role })
        .eq('dao_id', daoId)
        .eq('member_address', memberAddress)
        .select()
        .single();

      if (updateError) {
        return res.status(500).json({ error: 'Failed to update role' });
      }

      res.json({ data: updatedMember });
    } catch (error) {
      console.error('Update member role error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get DAO members
  async getMembers(req: Request, res: Response) {
    try {
      const { daoId } = req.params;
      const { role } = req.query;

      let query = supabase
        .from('dao_members')
        .select(`
          *,
          profile:profiles!member_address(*)
        `)
        .eq('dao_id', daoId);

      if (role) {
        query = query.eq('role', role);
      }

      const { data: members, error } = await query
        .order('joined_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: 'Failed to fetch members' });
      }

      res.json({ data: members });
    } catch (error) {
      console.error('Get members error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get member details
  async getMemberDetails(req: Request, res: Response) {
    try {
      const { daoId, memberAddress } = req.params;

      const { data: member, error } = await supabase
        .from('dao_members')
        .select(`
          *,
          profile:profiles!member_address(*),
          dao:daos!dao_id(*)
        `)
        .eq('dao_id', daoId)
        .eq('member_address', memberAddress)
        .single();

      if (error) {
        return res.status(404).json({ error: 'Member not found' });
      }

      res.json({ data: member });
    } catch (error) {
      console.error('Get member details error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
}; 