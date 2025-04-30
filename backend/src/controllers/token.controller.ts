import { Request, Response } from 'express';
import { supabase } from '../services/supabase';
import { ethers } from 'ethers';
import { TokenContract } from '../contracts/TokenContract';

interface TokenRequest extends Request {
  user?: {
    address: string;
    role: string;
  };
}

export const tokenController = {
  // Mint new tokens
  async mintTokens(req: TokenRequest, res: Response) {
    try {
      const { daoId, recipient, amount } = req.body;
      const minterAddress = req.user?.address;

      if (!minterAddress) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Verify user has permission to mint
      const { data: dao, error: daoError } = await supabase
        .from('daos')
        .select('*')
        .eq('id', daoId)
        .single();

      if (daoError || !dao) {
        return res.status(404).json({ error: 'DAO not found' });
      }

      if (dao.creator_address !== minterAddress && req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to mint tokens' });
      }

      // Mint tokens on-chain
      const tokenContract = new TokenContract(dao.token_address);
      await tokenContract.mint(recipient, amount);

      // Record minting in database
      const { data: mintRecord, error: recordError } = await supabase
        .from('token_transactions')
        .insert([{
          dao_id: daoId,
          from_address: minterAddress,
          to_address: recipient,
          amount,
          type: 'mint',
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (recordError) {
        return res.status(500).json({ error: 'Failed to record minting' });
      }

      res.status(201).json({ data: mintRecord });
    } catch (error) {
      console.error('Mint tokens error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Transfer tokens
  async transferTokens(req: TokenRequest, res: Response) {
    try {
      const { daoId, recipient, amount } = req.body;
      const senderAddress = req.user?.address;

      if (!senderAddress) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Get DAO token address
      const { data: dao, error: daoError } = await supabase
        .from('daos')
        .select('*')
        .eq('id', daoId)
        .single();

      if (daoError || !dao) {
        return res.status(404).json({ error: 'DAO not found' });
      }

      // Check sender's balance
      const tokenContract = new TokenContract(dao.token_address);
      const balance = await tokenContract.balanceOf(senderAddress);

      if (balance.lt(amount)) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      // Transfer tokens on-chain
      await tokenContract.transfer(recipient, amount);

      // Record transfer in database
      const { data: transferRecord, error: recordError } = await supabase
        .from('token_transactions')
        .insert([{
          dao_id: daoId,
          from_address: senderAddress,
          to_address: recipient,
          amount,
          type: 'transfer',
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (recordError) {
        return res.status(500).json({ error: 'Failed to record transfer' });
      }

      res.status(201).json({ data: transferRecord });
    } catch (error) {
      console.error('Transfer tokens error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get token balance
  async getBalance(req: Request, res: Response) {
    try {
      const { daoId, address } = req.params;

      // Get DAO token address
      const { data: dao, error: daoError } = await supabase
        .from('daos')
        .select('*')
        .eq('id', daoId)
        .single();

      if (daoError || !dao) {
        return res.status(404).json({ error: 'DAO not found' });
      }

      // Get balance from contract
      const tokenContract = new TokenContract(dao.token_address);
      const balance = await tokenContract.balanceOf(address);

      // Get transaction history
      const { data: transactions, error: txError } = await supabase
        .from('token_transactions')
        .select('*')
        .or(`from_address.eq.${address},to_address.eq.${address}`)
        .eq('dao_id', daoId)
        .order('created_at', { ascending: false });

      if (txError) {
        return res.status(500).json({ error: 'Failed to fetch transaction history' });
      }

      res.json({
        data: {
          balance: balance.toString(),
          transactions,
        },
      });
    } catch (error) {
      console.error('Get balance error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get token holders
  async getTokenHolders(req: Request, res: Response) {
    try {
      const { daoId } = req.params;

      // Get DAO token address
      const { data: dao, error: daoError } = await supabase
        .from('daos')
        .select('*')
        .eq('id', daoId)
        .single();

      if (daoError || !dao) {
        return res.status(404).json({ error: 'DAO not found' });
      }

      // Get holders from contract
      const tokenContract = new TokenContract(dao.token_address);
      const holders = await tokenContract.getHolders();

      // Get holder details from database
      const { data: holderDetails, error: holderError } = await supabase
        .from('profiles')
        .select('*')
        .in('wallet_address', holders);

      if (holderError) {
        return res.status(500).json({ error: 'Failed to fetch holder details' });
      }

      // Combine on-chain balances with holder details
      const holdersWithBalances = await Promise.all(
        holders.map(async (address) => {
          const balance = await tokenContract.balanceOf(address);
          const details = holderDetails.find((h) => h.wallet_address === address);
          return {
            address,
            balance: balance.toString(),
            ...details,
          };
        })
      );

      res.json({ data: holdersWithBalances });
    } catch (error) {
      console.error('Get token holders error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
}; 