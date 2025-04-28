import express from 'express';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter, authLimiter } from './middleware/rateLimiter';
import { sanitizeInput } from './middleware/sanitize';
import userRoutes from './routes/user';
import postRoutes from './routes/post';
import daoRoutes from './routes/dao';
import aiRoutes from './routes/ai';
import activitiesRoutes from './routes/activities';

const app = express();

// Middleware
app.use(express.json());
app.use(corsMiddleware);
app.use(sanitizeInput);

// Rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/daos', daoRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/activities', activitiesRoutes);

// Error handling
app.use(errorHandler);

export default app; 