import { Router } from 'express';
import { activityController } from '../controllers/activity.controller';
import { auth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', activityController.getAllActivities);
router.get('/dao/:daoId', activityController.getDaoActivities);
router.get('/user/:userId', activityController.getUserActivities);

// Protected routes
router.use(auth);
router.post('/', activityController.createActivity);

export default router; 