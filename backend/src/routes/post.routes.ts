import { Router } from 'express';
import { validate } from '../middleware/validate';
import { createPostSchema, updatePostSchema } from '../schemas/validation';
import { PostController } from '../controllers/post.controller';
import { auth } from '../middleware/auth';

const router = Router();
const postController = new PostController();

// Create a new post
router.post(
  '/',
  auth,
  validate(createPostSchema),
  postController.createPost
);

// Get all posts
router.get('/', postController.getAllPosts);

// Get a specific post
router.get('/:id', postController.getPost);

// Update a post
router.put(
  '/:id',
  auth,
  validate(updatePostSchema),
  postController.updatePost
);

// Delete a post
router.delete('/:id', auth, postController.deletePost);

// Like a post
router.post('/:id/like', auth, postController.likePost);

// Unlike a post
router.post('/:id/unlike', auth, postController.unlikePost);

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