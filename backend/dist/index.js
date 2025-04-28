import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { Connection } from '@solana/web3.js';
import postRoutes from './routes/post.js';
import aiRoutes from './routes/ai.js';
import userRoutes from './routes/user.js';
import daoRoutes from './routes/dao.js';
// Load environment variables
config();
// Initialize Express app
const app = express();
const port = process.env.PORT || 3001;
// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
// Initialize Solana connection
export const solanaConnection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com');
// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to ThreadDAO API' });
});
app.use('/api/posts', postRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/daos', daoRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
