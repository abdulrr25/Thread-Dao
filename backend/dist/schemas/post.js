import { z } from 'zod';
export const createPostSchema = z.object({
    content: z.string().min(1).max(1000),
    media: z.string().optional(),
    title: z.string().min(1).max(100),
    walletAddress: z.string().min(32).max(44), // Solana wallet address length
});
