import { z } from 'zod';

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