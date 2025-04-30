import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../utils/error';
import { Post } from '../models/post.model';
import { Comment } from '../models/comment.model';

export const getAllPosts = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const posts = await Post.find()
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit))
    .populate('author', 'name handle avatar')
    .populate('dao', 'name');

  const total = await Post.countDocuments();

  res.status(200).json({
    status: 'success',
    data: {
      posts,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    }
  });
});

export const createPost = catchAsync(async (req: Request, res: Response) => {
  const post = await Post.create({
    ...req.body,
    author: req.user.id
  });

  await post.populate('author', 'name handle avatar');
  if (post.dao) {
    await post.populate('dao', 'name');
  }

  res.status(201).json({
    status: 'success',
    data: { post }
  });
});

export const likePost = catchAsync(async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  if (post.likes.includes(req.user.id)) {
    throw new ApiError(400, 'You have already liked this post');
  }

  post.likes.push(req.user.id);
  await post.save();

  res.status(200).json({
    status: 'success',
    message: 'Post liked successfully'
  });
});

export const unlikePost = catchAsync(async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  if (!post.likes.includes(req.user.id)) {
    throw new ApiError(400, 'You have not liked this post');
  }

  post.likes = post.likes.filter(
    (id) => id.toString() !== req.user.id.toString()
  );
  await post.save();

  res.status(200).json({
    status: 'success',
    message: 'Post unliked successfully'
  });
});

export const createComment = catchAsync(async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const comment = await Comment.create({
    ...req.body,
    post: req.params.id,
    author: req.user.id
  });

  post.comments.push(comment._id);
  await post.save();

  await comment.populate('author', 'name handle avatar');

  res.status(201).json({
    status: 'success',
    data: { comment }
  });
});

export const getComments = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const comments = await Comment.find({ post: req.params.id })
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit))
    .populate('author', 'name handle avatar');

  const total = await Comment.countDocuments({ post: req.params.id });

  res.status(200).json({
    status: 'success',
    data: {
      comments,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    }
  });
}); 