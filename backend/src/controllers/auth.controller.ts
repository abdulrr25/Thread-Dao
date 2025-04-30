import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { hash, compare } from 'bcryptjs';
import { signToken, verifyToken } from '../utils/jwt';
import { ApiError } from '../utils/error';
import { logger } from '../utils/logger';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, handle, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { handle }
        ]
      }
    });

    if (existingUser) {
      throw new ApiError(400, 'User with this email or handle already exists');
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        handle,
        email,
        password: hashedPassword
      }
    });

    // Generate tokens
    const accessToken = signToken(user.id);
    const refreshToken = signToken(user.id, '7d');

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      status: 'success',
      data: {
        user: userWithoutPassword,
        tokens: {
          access: accessToken,
          refresh: refreshToken
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Check password
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate tokens
    const accessToken = signToken(user.id);
    const refreshToken = signToken(user.id, '7d');

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      status: 'success',
      data: {
        user: userWithoutPassword,
        tokens: {
          access: accessToken,
          refresh: refreshToken
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(401, 'Not authenticated');
    }

    // Generate new tokens
    const accessToken = signToken(user.id);
    const refreshToken = signToken(user.id, '7d');

    res.status(200).json({
      status: 'success',
      data: {
        tokens: {
          access: accessToken,
          refresh: refreshToken
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a real application, you might want to invalidate the refresh token
    // by adding it to a blacklist or removing it from the database
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
}; 