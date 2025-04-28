import { Request, Response, NextFunction } from 'express';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { AppError } from './errorHandler';

declare global {
  namespace Express {
    interface Request {
      user?: {
        walletAddress: string;
      };
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['x-signature'] as string;
    const message = req.headers['x-message'] as string;
    const publicKey = req.headers['x-public-key'] as string;

    if (!signature || !message || !publicKey) {
      return next(new AppError('Missing required authentication headers', 401));
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
        return next(new AppError('Invalid signature', 401));
      }

      // Add the user object to the request for use in route handlers
      req.user = {
        walletAddress: publicKey,
      };
      next();
    } catch (error) {
      return next(new AppError('Invalid signature or public key', 401));
    }
  } catch (error) {
    return next(new AppError('Internal server error during authentication', 500));
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('You are not logged in', 401));
    }

    // TODO: Implement role-based access control
    // This will require adding roles to the user model and checking them here
    next();
  };
}; 