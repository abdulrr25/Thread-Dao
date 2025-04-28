import rateLimit from 'express-rate-limit';
import { envVars } from '../lib/env';

export const apiLimiter = rateLimit({
  windowMs: parseInt(envVars.RATE_LIMIT_WINDOW_MS),
  max: parseInt(envVars.RATE_LIMIT_MAX),
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
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
}); 