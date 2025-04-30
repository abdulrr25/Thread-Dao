import app from './app';
import { envVars } from './lib/env';
import { logger } from './utils/logger';
import { createClient } from '@supabase/supabase-js';
import { Connection } from '@solana/web3.js';

// Initialize Supabase client
export const supabase = createClient(envVars.SUPABASE_URL, envVars.SUPABASE_ANON_KEY);

// Initialize Solana connection
export const solanaConnection = new Connection(envVars.SOLANA_RPC_URL);

const port = envVars.PORT;

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port} in ${envVars.NODE_ENV} mode`);
  logger.info(`Supabase URL: ${envVars.SUPABASE_URL}`);
// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(requestLogger);
app.use(apiLimiter);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/daos', daoRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port} in ${envVars.NODE_ENV} mode`);
  logger.info(`CORS origin: ${envVars.CORS_ORIGIN}`);
  logger.info(`Supabase URL: ${envVars.SUPABASE_URL}`);
  logger.info(`Solana RPC URL: ${envVars.SOLANA_RPC_URL}`);
});