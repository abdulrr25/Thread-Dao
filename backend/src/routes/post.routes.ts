import { Router } from 'express';
import { validate } from '../middleware/validate';
import { createPostSchema, updatePostSchema } from '../schemas/validation';
import { postController } from '../controllers/post.controller';
import { auth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', postController.getAllPosts);
router.get('/trending', postController.getTrendingPosts);
router.get('/:id', postController.getPost);
router.get('/:id/comments', postController.getPostComments);

// Protected routes
router.use(auth);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.post('/:id/like', postController.likePost);
router.delete('/:id/like', postController.unlikePost);
router.post('/:id/comment', postController.addComment);
router.put('/:id/comment/:commentId', postController.updateComment);
router.delete('/:id/comment/:commentId', postController.deleteComment);

// Comment on a post
router.post(
  '/:id/comments',
  auth,
  validate(createPostSchema),
  postController.createComment
);

// Get post comments
router.get('/:id/comments', postController.getComments);

// Get post likes
router.get('/:id/likes', postController.getLikes);

export default router; 