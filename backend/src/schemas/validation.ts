import { z } from 'zod';
import Joi from 'joi';

// DAO schemas
export const createDaoSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().min(10).max(500),
  tokenSymbol: z.string().min(2).max(10),
  initialSupply: z.number().positive(),
  votingPeriod: z.number().min(1).max(30), // in days
  quorum: z.number().min(1).max(100), // percentage
  imageUrl: z.string().url().optional(),
  socialLinks: z.object({
    website: z.string().url().optional(),
    twitter: z.string().url().optional(),
    discord: z.string().url().optional(),
    telegram: z.string().url().optional(),
  }).optional(),
});

export const updateDaoSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  description: z.string().min(10).max(500).optional(),
  imageUrl: z.string().url().optional(),
  socialLinks: z.object({
    website: z.string().url().optional(),
    twitter: z.string().url().optional(),
    discord: z.string().url().optional(),
    telegram: z.string().url().optional(),
  }).optional(),
  votingPeriod: z.number().min(1).max(30).optional(),
  quorum: z.number().min(1).max(100).optional(),
});

// Proposal schemas
export const createProposalSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(1000),
  type: z.enum(['GENERAL', 'TOKEN_TRANSFER', 'CONTRACT_UPDATE']),
  targetAddress: z.string().optional(),
  amount: z.number().optional(),
  data: z.string().optional(),
});

export const voteSchema = z.object({
  vote: z.enum(['FOR', 'AGAINST', 'ABSTAIN']),
  reason: z.string().max(200).optional(),
});

// Types
export type CreateDaoInput = z.infer<typeof createDaoSchema>;
export type UpdateDaoInput = z.infer<typeof updateDaoSchema>;
export type CreateProposalInput = z.infer<typeof createProposalSchema>;
export type VoteInput = z.infer<typeof voteSchema>;

// Token schemas
export const mintTokensSchema = z.object({
  body: z.object({
    recipient: z.string().min(42).max(42),
    amount: z.string().regex(/^\d+$/),
  }),
  params: z.object({
    daoId: z.string().uuid(),
  }),
});

export const transferTokensSchema = z.object({
  body: z.object({
    recipient: z.string().min(42).max(42),
    amount: z.string().regex(/^\d+$/),
  }),
  params: z.object({
    daoId: z.string().uuid(),
  }),
});

// Member schemas
export const updateMemberRoleSchema = z.object({
  body: z.object({
    role: z.enum(['member', 'admin']),
  }),
  params: z.object({
    daoId: z.string().uuid(),
    memberAddress: z.string().min(42).max(42),
  }),
});

export const joinDaoSchema = z.object({
  params: z.object({
    daoId: z.string().uuid(),
  }),
});

export const leaveDaoSchema = z.object({
  params: z.object({
    daoId: z.string().uuid(),
  }),
});

// User validation schemas
export const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  handle: Joi.string().required().min(3).max(30).pattern(/^[a-zA-Z0-9_]+$/),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8),
  walletAddress: Joi.string().pattern(/^[0-9a-fA-F]{40}$/)
});

export const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required()
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  handle: Joi.string().min(3).max(30).pattern(/^[a-zA-Z0-9_]+$/),
  bio: Joi.string().max(500),
  avatar: Joi.string().uri()
});

export const updateWalletSchema = Joi.object({
  walletAddress: Joi.string().required().pattern(/^[0-9a-fA-F]{40}$/)
});

// DAO validation schemas
export const createDAOSchema = Joi.object({
  name: Joi.string().required().min(3).max(50),
  description: Joi.string().required().max(1000),
  category: Joi.string().required().valid('defi', 'nft', 'governance', 'social', 'other'),
  tokenSymbol: Joi.string().required().max(10),
  tokenAddress: Joi.string().pattern(/^[0-9a-fA-F]{40}$/),
  isPublic: Joi.boolean(),
  votingPeriod: Joi.number().required().min(1).max(30),
  quorum: Joi.number().required().min(1).max(100)
});

export const updateDAOSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  description: Joi.string().max(1000),
  category: Joi.string().valid('defi', 'nft', 'governance', 'social', 'other'),
  isPublic: Joi.boolean()
});

// Proposal validation schemas
export const createProposalSchema = Joi.object({
  title: Joi.string().required().min(3).max(200),
  description: Joi.string().required().max(2000),
  type: Joi.string().required().valid('general', 'token', 'member'),
  startTime: Joi.date().required(),
  endTime: Joi.date().required().min(Joi.ref('startTime')),
  metadata: Joi.object()
});

export const voteSchema = Joi.object({
  vote: Joi.string().required().valid('for', 'against', 'abstain'),
  reason: Joi.string().max(500),
  power: Joi.number().required().min(0)
});

// Post validation schemas
export const createPostSchema = Joi.object({
  content: Joi.string().required().max(500),
  dao: Joi.string().pattern(/^[0-9a-fA-F]{24}$/)
});

export const updatePostSchema = Joi.object({
  content: Joi.string().max(500)
});

// Comment validation schemas
export const createCommentSchema = Joi.object({
  content: Joi.string().required().max(200)
});

export const updateCommentSchema = Joi.object({
  content: Joi.string().max(200)
}); 