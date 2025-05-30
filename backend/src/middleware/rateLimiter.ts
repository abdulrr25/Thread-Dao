import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  handler: (req: Request, res: Response, next: NextFunction) => {
    next(new AppError('Too many requests, please try again later', 429));
  },
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts from this IP, please try again after an hour',
  handler: (req: Request, res: Response, next: NextFunction) => {
    next(new AppError('Too many login attempts, please try again later', 429));
  },
}); 