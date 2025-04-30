import { PrismaClient } from '@prisma/client';
import { WebSocketManager } from './websocket';

const prisma = new PrismaClient();

export enum NotificationType {
  DAO_INVITE = 'DAO_INVITE',
  PROPOSAL_CREATED = 'PROPOSAL_CREATED',
  PROPOSAL_VOTED = 'PROPOSAL_VOTED',
  PROPOSAL_EXECUTED = 'PROPOSAL_EXECUTED',
  COMMENT_ADDED = 'COMMENT_ADDED',
  MENTION = 'MENTION',
}

interface NotificationData {
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}

export class NotificationManager {
  private static instance: NotificationManager;
  private wsManager: WebSocketManager;

  private constructor(wsManager: WebSocketManager) {
    this.wsManager = wsManager;
  }

  public static getInstance(wsManager: WebSocketManager): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager(wsManager);
    }
    return NotificationManager.instance;
  }

  async createNotification(
    userId: string,
    data: NotificationData
  ): Promise<void> {
    try {
      // Create notification in database
      const notification = await prisma.notification.create({
        data: {
          userId,
          type: data.type,
          title: data.title,
          message: data.message,
          data: data.data || {},
          read: false,
        },
      });

      // Send real-time notification if user is connected
      if (this.wsManager.isUserConnected(userId)) {
        this.wsManager.emitToUser(userId, 'notification', notification);
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    try {
      await prisma.notification.update({
        where: {
          id: notificationId,
          userId,
        },
        data: {
          read: true,
        },
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      await prisma.notification.updateMany({
        where: {
          userId,
          read: false,
        },
        data: {
          read: true,
        },
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      return await prisma.notification.count({
        where: {
          userId,
          read: false,
        },
      });
    } catch (error) {
      console.error('Error getting unread notification count:', error);
      return 0;
    }
  }

  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20
  ) {
    try {
      const skip = (page - 1) * limit;
      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where: {
            userId,
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limit,
        }),
        prisma.notification.count({
          where: {
            userId,
          },
        }),
      ]);

      return {
        notifications,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error getting user notifications:', error);
      return {
        notifications: [],
        total: 0,
        page,
        totalPages: 0,
      };
    }
  }
} 