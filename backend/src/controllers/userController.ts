import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { walletAddress: address },
      include: {
        daos: true,
        posts: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createUserProfile = async (req: Request, res: Response) => {
  try {
    const { walletAddress, username, bio, avatar } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { walletAddress }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await prisma.user.create({
      data: {
        walletAddress,
        username,
        bio,
        avatar
      }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { username, bio, avatar } = req.body;

    const user = await prisma.user.update({
      where: { walletAddress: address },
      data: {
        username,
        bio,
        avatar
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 