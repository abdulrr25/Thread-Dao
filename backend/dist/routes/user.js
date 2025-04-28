import express from 'express';
import { getUserProfile, createUserProfile, updateUserProfile } from '../controllers/userController';
const router = express.Router();
// Get user profile by wallet address
router.get('/profile/:address', getUserProfile);
// Create new user profile
router.post('/profile', createUserProfile);
// Update user profile
router.put('/profile/:address', updateUserProfile);
export default router;
