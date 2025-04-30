import { Router } from 'express';
import { validate } from '../middleware/validate';
import { createActivitySchema } from '../schemas/validation';
import { ActivityController } from '../controllers/activity.controller';
import { auth } from '../middleware/auth';

const router = Router();
const activityController = new ActivityController();

// Create a new activity
router.post(
  '/',
  auth,
  validate(createActivitySchema),
  activityController.createActivity
);

// Get all activities
router.get('/', activityController.getAllActivities);

// Get activities for a specific DAO
router.get('/dao/:daoId', activityController.getDaoActivities);

// Get activities for a specific user
router.get('/user/:userId', activityController.getUserActivities);

// Get a specific activity
router.get('/:id', activityController.getActivity);

export default router; 