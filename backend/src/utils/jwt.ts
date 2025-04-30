import jwt from 'jsonwebtoken';
import { ApiError } from './ApiError';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

export const verifyToken = (token: string): { id: string } => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string };
  } catch (error) {
    throw new ApiError(401, 'Invalid token');
  }
}; 