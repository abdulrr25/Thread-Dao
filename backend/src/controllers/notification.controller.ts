import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../utils/ApiError';
import { Notification } from '../models/notification.model';

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

export const getUnreadNotifications = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const notifications = await Notification.find({
    user: req.user.id,
    read: false
  })
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit))
    .populate('sender', 'name handle avatar');

  const total = await Notification.countDocuments({
    user: req.user.id,
    read: false
  });

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

export const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({
    status: 'success',
    message: 'Notification marked as read'
  });
});

export const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
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

export const deleteAllNotifications = catchAsync(async (req: Request, res: Response) => {
  await Notification.deleteMany({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    message: 'All notifications deleted successfully'
  });
}); 