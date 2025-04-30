import { Router } from 'express';
import { connectWallet, getProfile } from '../controllers/user';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/auth/connect', connectWallet);

// Protected routes
router.get('/profile', authenticate, getProfile);

export default router; 