import rateLimit from 'express-rate-limit';
import { envVars } from '../lib/env';
import { logger } from '../lib/logger';
import { ApiError } from '../utils/error';

const rateLimitWindow = parseInt(envVars.RATE_LIMIT_WINDOW_MS);
const rateLimitMax = parseInt(envVars.RATE_LIMIT_MAX);

if (isNaN(rateLimitWindow) || isNaN(rateLimitMax)) {
  logger.error('Invalid rate limit configuration', { rateLimitWindow, rateLimitMax });
  throw new Error('Invalid rate limit configuration');
}

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  handler: (req, res) => {
    throw new ApiError(429, 'Too many requests from this IP, please try again later');
  }
});

// Stricter limiter for auth routes
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
  handler: (req, res) => {
    throw new ApiError(429, 'Too many login attempts, please try again later');
  }
});

// DAO creation limiter
export const daoCreationLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3, // Limit each IP to 3 DAO creations per day
  message: 'Too many DAO creation attempts, please try again later',
  handler: (req, res) => {
    throw new ApiError(429, 'Too many DAO creation attempts, please try again later');
  }
}); 