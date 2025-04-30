import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { AppError } from '../lib/errors';
import { AuthenticatedRequest } from '../types/express.js';
import { AuthenticationError } from '../lib/errors';
import { envVars } from '../lib/env';
import { logger } from '../lib/logger';
import { verifyToken } from '../lib/jwt';
import { supabase } from '../services/supabase';

interface JwtPayload {
  walletAddress: string;
  iat: number;
  exp: number;
}

interface AuthRequest extends Request {
  user?: {
    address: string;
    role: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['x-signature'] as string;
    const message = req.headers['x-message'] as string;
    const publicKey = req.headers['x-public-key'] as string;

    if (!signature || !message || !publicKey) {
      logger.warn('Missing authentication headers', { headers: req.headers });
      return next(new AuthenticationError('Missing required authentication headers'));
    }

    // Verify the signature
    try {
      const pubKeyBytes = bs58.decode(publicKey);
      const verified = nacl.sign.detached.verify(
        new TextEncoder().encode(message),
        bs58.decode(signature),
        pubKeyBytes
      );

      if (!verified) {
        logger.warn('Invalid signature', { publicKey });
        return next(new AuthenticationError('Invalid signature'));
      }

      // Add the user object to the request for use in route handlers
      (req as AuthenticatedRequest).user = {
        walletAddress: publicKey,
      };
      logger.info('User authenticated successfully', { walletAddress: publicKey });
      next();
    } catch (error) {
      logger.error('Signature verification failed', { error, publicKey });
      return next(new AuthenticationError('Invalid signature or public key'));
    }
  } catch (error) {
    logger.error('Authentication error', { error });
    return next(new AppError('Internal server error during authentication', 500));
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      logger.warn('Unauthorized access attempt', { roles });
      return next(new AuthenticationError('You are not logged in'));
    }

    // TODO: Implement role-based access control
    // This will require adding roles to the user model and checking them here
    logger.info('Role check passed', { roles, user: req.user.walletAddress });
    next();
  };
};

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { address: string };

    // Verify user exists in database
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_address', decoded.address)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = {
      address: decoded.address,
      role: user.role || 'member',
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}; 