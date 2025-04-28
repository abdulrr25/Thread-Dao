import { z } from 'zod';

// User Profile Validation
export const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters'),
  avatar: z.string().url('Invalid avatar URL'),
});

// DAO Validation
export const daoSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  token_name: z.string().min(2, 'Token name must be at least 2 characters'),
  token_symbol: z.string().min(2, 'Token symbol must be at least 2 characters').max(5, 'Token symbol must be at most 5 characters'),
});

// Post Validation
export const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
});

// Proposal Validation
export const proposalSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  voting_duration: z.number().min(1, 'Voting duration must be at least 1 day'),
});

// Comment Validation
export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
});

// Type exports
export type ProfileFormData = z.infer<typeof profileSchema>;
export type DaoFormData = z.infer<typeof daoSchema>;
export type PostFormData = z.infer<typeof postSchema>;
export type ProposalFormData = z.infer<typeof proposalSchema>;
export type CommentFormData = z.infer<typeof commentSchema>; 