import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: {
      walletAddress: string;
    };
  }
}

export interface AuthenticatedRequest extends Request {
  user: {
    walletAddress: string;
  };
} 