import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../utils/error';
import { User } from '../models/user.model';
import { DAO } from '../models/dao.model';
import { Post } from '../models/post.model';
import { Notification } from '../models/notification.model';
import { generateToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/password';

export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, handle, email, password, walletAddress } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { handle }, { walletAddress }]
  });

  if (existingUser) {
    throw new ApiError(400, 'User already exists with this email, handle, or wallet address');
  }

  // Create new user
  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    name,
    handle,
    email,
    password: hashedPassword,
    walletAddress
  });

  // Generate JWT token
  const token = generateToken(user._id);

  res.status(201).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        name: user.name,
        handle: user.handle,
        email: user.email,
        walletAddress: user.walletAddress
      },
      token
    }
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Check password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Generate JWT token
  const token = generateToken(user._id);

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        name: user.name,
        handle: user.handle,
        email: user.email,
        walletAddress: user.walletAddress
      },
      token
    }
  });
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id)
    .select('-password')
    .populate('daos', 'name description');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

export const getUserDAOs = catchAsync(async (req: Request, res: Response) => {
  const daos = await DAO.find({ members: req.params.id })
    .populate('creator', 'name handle avatar');

  res.status(200).json({
    status: 'success',
    data: { daos }
  });
});

export const getUserPosts = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const posts = await Post.find({ author: req.params.id })
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit))
    .populate('author', 'name handle avatar')
    .populate('dao', 'name');

  const total = await Post.countDocuments({ author: req.params.id });

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

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const { name, handle, bio, avatar } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Check if handle is already taken
  if (handle && handle !== user.handle) {
    const existingUser = await User.findOne({ handle });
    if (existingUser) {
      throw new ApiError(400, 'Handle is already taken');
    }
  }

  Object.assign(user, { name, handle, bio, avatar });
  await user.save();

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        name: user.name,
        handle: user.handle,
        bio: user.bio,
        avatar: user.avatar,
        walletAddress: user.walletAddress
      }
    }
  });
});

export const updateWallet = catchAsync(async (req: Request, res: Response) => {
  const { walletAddress } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Check if wallet address is already registered
  const existingUser = await User.findOne({ walletAddress });
  if (existingUser && existingUser._id.toString() !== req.user.id) {
    throw new ApiError(400, 'Wallet address is already registered');
  }

  user.walletAddress = walletAddress;
  await user.save();

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        walletAddress: user.walletAddress
      }
    }
  });
});

export const getNotifications = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const notifications = await Notification.find({ user: req.user.id })
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit))
    .populate('sender', 'name handle avatar');

  const total = await Notification.countDocuments({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    data: {
      notifications,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    }
  });
});

export const markNotificationsAsRead = catchAsync(async (req: Request, res: Response) => {
  await Notification.updateMany(
    { user: req.user.id, read: false },
    { read: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'All notifications marked as read'
  });
});

export const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  await notification.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Notification deleted successfully'
  });
}); 