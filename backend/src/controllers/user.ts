import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as nacl from 'tweetnacl';
import bs58 from 'bs58';
import { createToken } from '../lib/jwt';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

export const connectWallet = async (req: Request, res: Response) => {
  try {
    const { walletAddress, signature, message } = req.body;

    if (!walletAddress || !signature || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify the signature using tweetnacl
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = bs58.decode(signature);
    const publicKeyBytes = bs58.decode(walletAddress);
    
    const isValid = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { walletAddress },
      });
    }

    // Generate JWT token
    const token = createToken(user.id);

    res.json({
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    logger.error('Error in connectWallet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: true,
        createdDaos: true,
        memberDaos: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      walletAddress: user.walletAddress,
      createdAt: user.createdAt,
      posts: user.posts,
      createdDaos: user.createdDaos,
      memberDaos: user.memberDaos,
    });
  } catch (error) {
    logger.error('Error in getProfile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 