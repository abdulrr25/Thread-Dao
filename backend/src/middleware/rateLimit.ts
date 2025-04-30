import rateLimit from 'express-rate-limit';
import { envVars } from '../lib/env';
import { logger } from '../lib/logger';

const rateLimitWindow = parseInt(envVars.RATE_LIMIT_WINDOW_MS);
const rateLimitMax = parseInt(envVars.RATE_LIMIT_MAX);

if (isNaN(rateLimitWindow) || isNaN(rateLimitMax)) {
  logger.error('Invalid rate limit configuration', { rateLimitWindow, rateLimitMax });
  throw new Error('Invalid rate limit configuration');
}

export const apiLimiter = rateLimit({
  windowMs: rateLimitWindow,
  max: rateLimitMax,
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method,
    });
    res.status(options.statusCode).json(options.message);
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: {
    status: 'error',
    message: 'Too many login attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn('Auth rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method,
    });
    res.status(options.statusCode).json(options.message);
  },
}); 