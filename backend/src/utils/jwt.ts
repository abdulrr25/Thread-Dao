import jwt from 'jsonwebtoken';
import { envVars } from '../lib/env';
import { ApiError } from './ApiError';

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

export const signToken = (userId: string, expiresIn: string = '1h'): string => {
  return jwt.sign(
    { id: userId },
    envVars.JWT_SECRET,
    { expiresIn }
  );
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, envVars.JWT_SECRET) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, 'Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, 'Invalid token');
    }
    throw error;
  }
}; 