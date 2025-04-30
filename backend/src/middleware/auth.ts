import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../types/express';
import { verifyToken } from '../utils/jwt';
import { AuthenticationError, AuthorizationError } from '../lib/errors';

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1) Get token from Authorization header
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      logger.warn('No auth token provided', { path: req.path });
      throw new AuthenticationError('You are not logged in. Please log in to get access.');
    }

    // 2) Verify token
    const decoded = verifyToken(token);

    // 3) Check if user still exists
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!currentUser) {
      logger.warn('User not found for token', { userId: decoded.id });
      throw new AuthenticationError('The user belonging to this token no longer exists.');
    }

    // Grant access to protected route
    req.user = currentUser;
    logger.info('User authenticated successfully', { userId: currentUser.id });
    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      next(error);
    } else {
      logger.error('Authentication error', { error });
      next(new AuthenticationError('Invalid token. Please log in again.'));
    }
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

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);

    // Get user from token
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        walletAddress: true
      }
    });
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      throw new AuthenticationError('Insufficient permissions');
    }

    next();
  };
};

// Middleware for checking if user is a DAO member
export const isDAOMember = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { daoId } = req.params;
    const currentUser = req.user;

    const dao = await prisma.dao.findFirst({
      where: {
        id: daoId,
        members: {
          some: {
            id: currentUser.id
          }
        }
      }
    });

    if (!dao) {
      logger.warn('User not a member of DAO', { userId: currentUser.id, daoId });
      throw new AuthorizationError('You are not a member of this DAO');
    }

    logger.info('DAO membership verified', { userId: currentUser.id, daoId });
    next();
  } catch (error) {
    next(error);
  }
}; 