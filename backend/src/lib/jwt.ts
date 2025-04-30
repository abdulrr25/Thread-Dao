import jwt from 'jsonwebtoken';
import { envVars } from './env';

export const createToken = (userId: string): string => {
  return jwt.sign({ id: userId }, envVars.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string): { id: string } => {
  try {
    return jwt.verify(token, envVars.JWT_SECRET) as { id: string };
  } catch (error) {
    throw new Error('Invalid token');
  }
}; 