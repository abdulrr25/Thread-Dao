import { Request, Response, NextFunction } from 'express';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import nacl from 'tweetnacl';

declare global {
  namespace Express {
    interface Request {
      user?: {
        walletAddress: string;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const signature = req.headers['x-signature'] as string;
    const message = req.headers['x-message'] as string;
    const publicKey = req.headers['x-public-key'] as string;

    if (!signature || !message || !publicKey) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Missing required authentication headers',
      });
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
        return res.status(401).json({
          error: 'Authentication failed',
          message: 'Invalid signature',
        });
      }

      // Add the user object to the request for use in route handlers
      req.user = {
        walletAddress: publicKey,
      };
      next();
    } catch (error) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid signature or public key',
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Authentication failed',
      message: 'Internal server error during authentication',
    });
  }
}; 