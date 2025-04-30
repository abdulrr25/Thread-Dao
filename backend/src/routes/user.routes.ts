import { Router } from 'express';
import { validate } from '../middleware/validate';
import { createUserSchema, updateUserSchema } from '../schemas/validation';
import { UserController } from '../controllers/user.controller';
import { auth } from '../middleware/auth';

const router = Router();
const userController = new UserController();

// Register a new user
router.post(
  '/register',
  validate(createUserSchema),
  userController.register
);

// Login user
router.post('/login', userController.login);

// Get user profile
router.get('/profile', auth, userController.getProfile);

// Update user profile
router.put(
  '/profile',
  auth,
  validate(updateUserSchema),
  userController.updateProfile
);

// Get user's DAOs
router.get('/daos', auth, userController.getUserDAOs);

// Get user's posts
router.get('/posts', auth, userController.getUserPosts);

// Get user's activities
router.get('/activities', auth, userController.getUserActivities);

export default router; 