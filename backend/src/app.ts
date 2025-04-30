import express from 'express';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter, authLimiter } from './middleware/rateLimiter';
import { sanitizeInput } from './middleware/sanitize';
import { requestLogger } from './middleware/requestLogger';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { logger } from './utils/logger';
import { envVars } from './lib/env';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import postRoutes from './routes/post.routes';
import daoRoutes from './routes/dao.routes';
import proposalRoutes from './routes/proposal.routes';
import aiRoutes from './routes/ai.routes';
import activitiesRoutes from './routes/activities.routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(corsMiddleware);
app.use(sanitizeInput);

// Logging middleware
app.use(morgan('dev'));
app.use(requestLogger);

// Body parsing
app.use(express.json());

// Rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/daos', daoRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/activities', activitiesRoutes);

// Error handling
app.use(errorHandler);

// Log startup information
logger.info(`Server initialized in ${envVars.NODE_ENV} mode`);
logger.info(`CORS origin: ${envVars.CORS_ORIGIN}`);

export default app; 