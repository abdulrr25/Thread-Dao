import { z } from 'zod';
import { config } from 'dotenv';

config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  SOLANA_RPC_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  OPENAI_API_KEY: z.string(),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'), // 15 minutes
  RATE_LIMIT_MAX: z.string().default('100'),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('❌ Invalid environment variables:', env.error.format());
  process.exit(1);
}

export const envVars = env.data; 