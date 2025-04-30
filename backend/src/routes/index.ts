import { Router } from 'express';
import userRoutes from './user.routes';
import daoRoutes from './dao.routes';
import postRoutes from './post.routes';
import notificationRoutes from './notification.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/daos', daoRoutes);
router.use('/posts', postRoutes);
router.use('/notifications', notificationRoutes);

export default router; 