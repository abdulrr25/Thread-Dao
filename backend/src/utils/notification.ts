import { PrismaClient } from '@prisma/client';
import { ApiError } from './error';
import { WebSocketManager } from './websocket';
import { Logger } from './logger';
import { ConfigManager } from './config';
import nodemailer from 'nodemailer';
import { Queue } from './queue';
import { Cache } from './cache';

interface NotificationData {
  type: string;
  title: string;
  message: string;
  metadata?: any;
}

interface NotificationOptions {
  ttl?: number;
  priority?: 'high' | 'medium' | 'low';
  channels?: ('email' | 'push' | 'inApp' | 'websocket')[];
  data?: Record<string, any>;
}

interface NotificationConfig {
  email: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  defaultTTL: number;
  maxNotifications: number;
  batchSize: number;
  channels: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    websocket: boolean;
  };
}

interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  priority: 'high' | 'medium' | 'low';
  channels: ('email' | 'push' | 'inApp' | 'websocket')[];
  read: boolean;
  createdAt: Date;
  expiresAt: Date;
}

export class NotificationManager {
  private static instance: NotificationManager;
  private prisma: PrismaClient;
  private wsManager: WebSocketManager;
  private logger: Logger;
  private config: ConfigManager;
  private emailTransporter: nodemailer.Transporter;
  private queue: Queue;
  private cache: Cache;

  private constructor() {
    this.prisma = new PrismaClient();
    this.wsManager = WebSocketManager.getInstance();
    this.logger = Logger.getInstance();
    this.config = ConfigManager.getInstance();
    this.queue = Queue.getInstance();
    this.cache = Cache.getInstance();

    const notificationConfig = this.config.getNotificationConfig();
    this.emailTransporter = nodemailer.createTransport(notificationConfig.email);
  }

  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  public async createNotification(
    userId: string,
    data: NotificationData
  ): Promise<void> {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          userId,
          type: data.type,
          title: data.title,
          message: data.message,
          metadata: data.metadata,
          read: false,
        },
      });

      // Send real-time notification
      await this.wsManager.sendToUser(userId, 'notification', notification);
    } catch (error) {
      console.error('Create notification error:', error);
      throw new ApiError(500, 'Failed to create notification');
    }
  }

  public async sendDAONotification(
    daoId: string,
    type: string,
    message: string,
    metadata?: any
  ): Promise<void> {
    try {
      // Get all DAO members
      const members = await this.prisma.dAOMember.findMany({
        where: { daoId },
        select: { userId: true },
      });

      // Create notifications for all members
      const notifications = await Promise.all(
        members.map((member) =>
          this.prisma.notification.create({
            data: {
              userId: member.userId,
              type,
              title: `DAO Update`,
              message,
              metadata,
              read: false,
            },
          })
        )
      );

      // Send real-time notifications
      await Promise.all(
        notifications.map((notification) =>
          this.wsManager.sendToUser(notification.userId, 'notification', notification)
        )
      );
    } catch (error) {
      console.error('Send DAO notification error:', error);
      throw new ApiError(500, 'Failed to send DAO notification');
    }
  }

  public async sendProposalNotification(
    proposalId: string,
    type: string,
    message: string,
    metadata?: any
  ): Promise<void> {
    try {
      // Get proposal details
      const proposal = await this.prisma.proposal.findUnique({
        where: { id: proposalId },
        include: { dao: true },
      });

      if (!proposal) {
        throw new ApiError(404, 'Proposal not found');
      }

      // Get DAO members
      const members = await this.prisma.dAOMember.findMany({
        where: { daoId: proposal.daoId },
        select: { userId: true },
      });

      // Create notifications for all members
      const notifications = await Promise.all(
        members.map((member) =>
          this.prisma.notification.create({
            data: {
              userId: member.userId,
              type,
              title: `Proposal Update`,
              message,
              metadata: {
                ...metadata,
                proposalId,
                daoId: proposal.daoId,
              },
              read: false,
            },
          })
        )
      );

      // Send real-time notifications
      await Promise.all(
        notifications.map((notification) =>
          this.wsManager.sendToUser(notification.userId, 'notification', notification)
        )
      );
    } catch (error) {
      console.error('Send proposal notification error:', error);
      throw new ApiError(500, 'Failed to send proposal notification');
    }
  }

  public async getNotifications(
    userId: string,
    options: NotificationOptions = {}
  ): Promise<{ notifications: any[]; total: number }> {
    try {
      const { ttl = 0, priority, channels } = options;

      const where = {
        userId,
        ...(priority ? { priority } : {}),
        ...(channels ? { channels: { hasSome: channels } } : {}),
      };

      const [notifications, total] = await Promise.all([
        this.prisma.notification.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: 20,
          skip: 0,
        }),
        this.prisma.notification.count({ where }),
      ]);

      return { notifications, total };
    } catch (error) {
      console.error('Get notifications error:', error);
      throw new ApiError(500, 'Failed to get notifications');
    }
  }

  public async markAsRead(
    userId: string,
    notificationIds: string[]
  ): Promise<void> {
    try {
      await this.prisma.notification.updateMany({
        where: {
          id: { in: notificationIds },
          userId,
        },
        data: { read: true },
      });
    } catch (error) {
      console.error('Mark as read error:', error);
      throw new ApiError(500, 'Failed to mark notifications as read');
    }
  }

  public async markAllAsRead(userId: string): Promise<void> {
    try {
      await this.prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      });
    } catch (error) {
      console.error('Mark all as read error:', error);
      throw new ApiError(500, 'Failed to mark all notifications as read');
    }
  }

  public async deleteNotification(
    userId: string,
    notificationId: string
  ): Promise<void> {
    try {
      await this.prisma.notification.delete({
        where: {
          id: notificationId,
          userId,
        },
      });
    } catch (error) {
      console.error('Delete notification error:', error);
      throw new ApiError(500, 'Failed to delete notification');
    }
  }

  public async deleteAllNotifications(userId: string): Promise<void> {
    try {
      await this.prisma.notification.deleteMany({
        where: { userId },
      });
    } catch (error) {
      console.error('Delete all notifications error:', error);
      throw new ApiError(500, 'Failed to delete all notifications');
    }
  }

  public async send(
    userId: string,
    options: NotificationOptions
  ): Promise<void> {
    try {
      const { type, title, message, data, ttl, priority, channels } = options;

      // Send WebSocket notification
      await this.wsManager.sendNotification(userId, {
        type,
        title,
        message,
        data,
        timestamp: new Date().toISOString(),
      });

      // Send email notification
      if (channels?.includes('email')) {
        await this.sendEmail(userId, {
          type,
          title,
          message,
          data,
        });
      }

      this.logger.info('Notification sent', {
        userId,
        type,
        title,
        email: channels?.includes('email'),
        websocket: channels?.includes('websocket'),
      });
    } catch (error) {
      this.logger.error('Send notification error:', error);
      throw new ApiError(500, 'Failed to send notification');
    }
  }

  public async sendToMultiple(
    userIds: string[],
    options: NotificationOptions
  ): Promise<void> {
    try {
      await Promise.all(userIds.map((userId) => this.send(userId, options)));
    } catch (error) {
      this.logger.error('Send multiple notifications error:', error);
      throw new ApiError(500, 'Failed to send notifications');
    }
  }

  public async sendToDAO(
    daoId: string,
    options: NotificationOptions
  ): Promise<void> {
    try {
      // Get DAO members from database
      const members = await this.prisma.dAOMember.findMany({
        where: { daoId },
        select: { userId: true },
      });

      const userIds = members.map((member) => member.userId);
      await this.sendToMultiple(userIds, options);
    } catch (error) {
      this.logger.error('Send DAO notification error:', error);
      throw new ApiError(500, 'Failed to send DAO notification');
    }
  }

  private async sendEmail(
    userId: string,
    notification: Omit<NotificationOptions, 'email' | 'websocket'>
  ): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      });

      if (!user?.email) {
        throw new ApiError(400, 'User email not found');
      }

      const { type, title, message } = notification;
      const html = this.generateEmailTemplate(type, title, message);

      await this.emailTransporter.sendMail({
        from: this.config.getNotificationConfig().email.auth.user,
        to: user.email,
        subject: title,
        html,
      });

      this.logger.info('Email notification sent', {
        userId,
        email: user.email,
        type,
        title,
      });
    } catch (error) {
      this.logger.error('Send email notification error:', error);
      throw new ApiError(500, 'Failed to send email notification');
    }
  }

  private generateEmailTemplate(
    type: string,
    title: string,
    message: string
  ): string {
    const colors = {
      info: '#3498db',
      success: '#2ecc71',
      warning: '#f1c40f',
      error: '#e74c3c',
    };

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: ${colors[type as keyof typeof colors]};
              color: white;
              padding: 20px;
              text-align: center;
            }
            .content {
              padding: 20px;
              background-color: #f9f9f9;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${title}</h1>
            </div>
            <div class="content">
              <p>${message}</p>
            </div>
            <div class="footer">
              <p>This is an automated message from ThreadDAO. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  public async createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    options: NotificationOptions = {}
  ): Promise<Notification> {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          userId,
          type,
          title,
          message,
          data: options.data,
          priority: options.priority || 'medium',
          channels: options.channels || Object.keys(this.config.channels).filter(
            (channel) => this.config.channels[channel as keyof typeof this.config.channels]
          ),
          read: false,
          expiresAt: new Date(Date.now() + (options.ttl || this.config.defaultTTL)),
        },
      });

      // Cache the notification
      await this.cache.set(
        `notification:${notification.id}`,
        notification,
        { ttl: options.ttl || this.config.defaultTTL }
      );

      // Add to user's notification list
      await this.cache.lpush(
        `user:${userId}:notifications`,
        notification.id,
        { ttl: options.ttl || this.config.defaultTTL }
      );

      // Trim the list if it exceeds maxNotifications
      await this.cache.ltrim(
        `user:${userId}:notifications`,
        0,
        this.config.maxNotifications - 1
      );

      // Queue notification delivery
      await this.queue.add('notifications', {
        notification,
        channels: options.channels || Object.keys(this.config.channels).filter(
          (channel) => this.config.channels[channel as keyof typeof this.config.channels]
        ),
      });

      return notification;
    } catch (error) {
      this.logger.error('Error creating notification:', error);
      throw new ApiError(500, 'Failed to create notification');
    }
  }

  public async getNotification(userId: string, page = 1, limit = 10): Promise<Notification[]> {
    try {
      const start = (page - 1) * limit;
      const end = start + limit - 1;

      // Get notification IDs from cache
      const notificationIds = await this.cache.lrange(
        `user:${userId}:notifications`,
        start,
        end
      );

      if (!notificationIds.length) {
        // If not in cache, get from database
        const notifications = await this.prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          skip: start,
          take: limit,
        });

        // Cache the notifications
        await Promise.all(
          notifications.map((notification) =>
            this.cache.set(
              `notification:${notification.id}`,
              notification,
              { ttl: this.config.defaultTTL }
            )
          )
        );

        return notifications;
      }

      // Get notifications from cache
      const notifications = await Promise.all(
        notificationIds.map((id) => this.cache.get<Notification>(`notification:${id}`))
      );

      return notifications.filter((n): n is Notification => n !== null);
    } catch (error) {
      this.logger.error('Error getting notifications:', error);
      throw new ApiError(500, 'Failed to get notifications');
    }
  }

  public async markAsReadNotification(userId: string, notificationId: string): Promise<void> {
    try {
      // Update in database
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: { read: true },
      });

      // Update in cache
      const notification = await this.cache.get<Notification>(`notification:${notificationId}`);
      if (notification) {
        notification.read = true;
        await this.cache.set(
          `notification:${notificationId}`,
          notification,
          { ttl: this.config.defaultTTL }
        );
      }
    } catch (error) {
      this.logger.error('Error marking notification as read:', error);
      throw new ApiError(500, 'Failed to mark notification as read');
    }
  }

  public async markAllAsReadNotification(userId: string): Promise<void> {
    try {
      // Update in database
      await this.prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      });

      // Update in cache
      const notificationIds = await this.cache.lrange(
        `user:${userId}:notifications`,
        0,
        -1
      );

      await Promise.all(
        notificationIds.map(async (id) => {
          const notification = await this.cache.get<Notification>(`notification:${id}`);
          if (notification) {
            notification.read = true;
            await this.cache.set(
              `notification:${id}`,
              notification,
              { ttl: this.config.defaultTTL }
            );
          }
        })
      );
    } catch (error) {
      this.logger.error('Error marking all notifications as read:', error);
      throw new ApiError(500, 'Failed to mark all notifications as read');
    }
  }

  public async deleteNotification(userId: string, notificationId: string): Promise<void> {
    try {
      // Delete from database
      await this.prisma.notification.delete({
        where: { id: notificationId },
      });

      // Delete from cache
      await this.cache.del(`notification:${notificationId}`);
      await this.cache.lrem(`user:${userId}:notifications`, 0, notificationId);
    } catch (error) {
      this.logger.error('Error deleting notification:', error);
      throw new ApiError(500, 'Failed to delete notification');
    }
  }

  public async deleteAllNotifications(userId: string): Promise<void> {
    try {
      // Delete from database
      await this.prisma.notification.deleteMany({
        where: { userId },
      });

      // Delete from cache
      const notificationIds = await this.cache.lrange(
        `user:${userId}:notifications`,
        0,
        -1
      );

      await Promise.all([
        ...notificationIds.map((id) => this.cache.del(`notification:${id}`)),
        this.cache.del(`user:${userId}:notifications`),
      ]);
    } catch (error) {
      this.logger.error('Error deleting all notifications:', error);
      throw new ApiError(500, 'Failed to delete all notifications');
    }
  }

  public async getUnreadCount(userId: string): Promise<number> {
    try {
      return await this.prisma.notification.count({
        where: { userId, read: false },
      });
    } catch (error) {
      this.logger.error('Error getting unread count:', error);
      throw new ApiError(500, 'Failed to get unread count');
    }
  }

  public async sendBatch(
    userIds: string[],
    type: string,
    title: string,
    message: string,
    options: NotificationOptions = {}
  ): Promise<void> {
    try {
      // Process in batches
      for (let i = 0; i < userIds.length; i += this.config.batchSize) {
        const batch = userIds.slice(i, i + this.config.batchSize);
        await Promise.all(
          batch.map((userId) =>
            this.createNotification(userId, type, title, message, options)
          )
        );
      }
    } catch (error) {
      this.logger.error('Error sending batch notifications:', error);
      throw new ApiError(500, 'Failed to send batch notifications');
    }
  }
} 