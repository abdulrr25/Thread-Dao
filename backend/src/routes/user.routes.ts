import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { auth } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/:id', userController.getUser);
router.get('/:id/daos', userController.getUserDAOs);
router.get('/:id/posts', userController.getUserPosts);

// Protected routes
router.use(auth);
router.put('/profile', userController.updateProfile);
router.put('/wallet', userController.updateWallet);
router.get('/notifications', userController.getNotifications);
router.put('/notifications/read', userController.markNotificationsAsRead);
router.delete('/notifications/:id', userController.deleteNotification);

export default router; 