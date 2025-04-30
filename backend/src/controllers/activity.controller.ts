import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../utils/ApiError';
import { Activity } from '../models/activity.model';

export const getAllActivities = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const activities = await Activity.find()
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit))
    .populate('user', 'name handle avatar')
    .populate('dao', 'name');

  const total = await Activity.countDocuments();

  res.status(200).json({
    status: 'success',
    data: {
      activities,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    }
  });
});

export const getDaoActivities = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const activities = await Activity.find({ dao: req.params.daoId })
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit))
    .populate('user', 'name handle avatar')
    .populate('dao', 'name');

  const total = await Activity.countDocuments({ dao: req.params.daoId });

  res.status(200).json({
    status: 'success',
    data: {
      activities,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    }
  });
});

export const getUserActivities = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const activities = await Activity.find({ user: req.params.userId })
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit))
    .populate('user', 'name handle avatar')
    .populate('dao', 'name');

  const total = await Activity.countDocuments({ user: req.params.userId });

  res.status(200).json({
    status: 'success',
    data: {
      activities,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    }
  });
});

export const createActivity = catchAsync(async (req: Request, res: Response) => {
  const { type, dao, description, metadata } = req.body;

  const activity = await Activity.create({
    type,
    dao,
    user: req.user.id,
    description,
    metadata
  });

  await activity.populate('user', 'name handle avatar');
  await activity.populate('dao', 'name');

  res.status(201).json({
    status: 'success',
    data: { activity }
  });
}); 