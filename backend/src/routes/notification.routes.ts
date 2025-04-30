import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { auth } from '../middleware/auth';

const router = Router();

// All notification routes are protected
router.use(auth);

router.get('/', notificationController.getNotifications);
router.get('/unread', notificationController.getUnreadNotifications);
router.put('/:id/read', notificationController.markAsRead);
router.put('/read-all', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);
router.delete('/all', notificationController.deleteAllNotifications);

export default router; 