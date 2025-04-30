import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform(Number).default('3001'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  
  // Database
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  
  // Blockchain
  SOLANA_RPC_URL: z.string().url(),
  
  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  
  // Auth Rate Limiting
  AUTH_RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('3600000'), // 1 hour
  AUTH_RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('5'),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error.errors);
    process.exit(1);
  }
};

export const envVars = parseEnv();

// Type for environment variables
export type EnvVars = z.infer<typeof envSchema>; 