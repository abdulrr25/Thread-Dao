import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createClient } from '@supabase/supabase-js';
import { Connection } from '@solana/web3.js';
import { envVars } from './lib/env';
import { logger } from './lib/logger';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter, authLimiter } from './middleware/rateLimit';
import postRoutes from './routes/post.js';
import aiRoutes from './routes/ai.js';
import userRoutes from './routes/user.js';
import daoRoutes from './routes/dao.js';

// Initialize Express app
const app = express();
const port = envVars.PORT;

// Initialize Supabase client
export const supabase = createClient(envVars.SUPABASE_URL, envVars.SUPABASE_ANON_KEY);

// Initialize Solana connection
export const solanaConnection = new Connection(envVars.SOLANA_RPC_URL);

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Apply rate limiting
app.use(apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ThreadDAO API' });
});

// Apply auth rate limiting to auth routes
app.use('/api/users/auth', authLimiter);

// API routes
app.use('/api/posts', postRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/daos', daoRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port} in ${envVars.NODE_ENV} mode`);
});