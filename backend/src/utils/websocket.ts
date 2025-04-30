import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { NotificationManager } from './notification';
import { ApiError } from './error';

interface WebSocketUser {
  userId: string;
  socketId: string;
  daos: string[];
}

export class WebSocketManager {
  private static instance: WebSocketManager;
  private io: Server;
  private users: Map<string, WebSocketUser>;
  private notificationManager: NotificationManager;

  private constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    this.users = new Map();
    this.notificationManager = NotificationManager.getInstance();
    this.setupEventHandlers();
  }

  public static getInstance(server?: HttpServer): WebSocketManager {
    if (!WebSocketManager.instance && server) {
      WebSocketManager.instance = new WebSocketManager(server);
    }
    return WebSocketManager.instance;
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      // Handle user authentication
      socket.on('authenticate', async (data: { userId: string; daos: string[] }) => {
        try {
          this.users.set(socket.id, {
            userId: data.userId,
            socketId: socket.id,
            daos: data.daos,
          });

          // Join DAO rooms
          data.daos.forEach((daoId) => {
            socket.join(`dao:${daoId}`);
          });

          // Join user's personal room
          socket.join(`user:${data.userId}`);

          socket.emit('authenticated', { success: true });
        } catch (error) {
          console.error('Authentication error:', error);
          socket.emit('error', { message: 'Authentication failed' });
        }
      });

      // Handle DAO chat messages
      socket.on('chat:message', async (data: {
        daoId: string;
        message: string;
        type: 'text' | 'image' | 'file';
        metadata?: any;
      }) => {
        try {
          const user = this.users.get(socket.id);
          if (!user) {
            throw new Error('User not authenticated');
          }

          const messageData = {
            id: Date.now().toString(),
            daoId: data.daoId,
            userId: user.userId,
            message: data.message,
            type: data.type,
            metadata: data.metadata,
            timestamp: new Date(),
          };

          // Broadcast to DAO room
          this.io.to(`dao:${data.daoId}`).emit('chat:message', messageData);

          // Store message in database (to be implemented)
          // await this.storeMessage(messageData);
        } catch (error) {
          console.error('Chat message error:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Handle proposal updates
      socket.on('proposal:update', async (data: {
        daoId: string;
        proposalId: string;
        status: 'created' | 'voting' | 'executed' | 'rejected';
        metadata?: any;
      }) => {
        try {
          const user = this.users.get(socket.id);
          if (!user) {
            throw new Error('User not authenticated');
          }

          const updateData = {
            daoId: data.daoId,
            proposalId: data.proposalId,
            status: data.status,
            metadata: data.metadata,
            timestamp: new Date(),
          };

          // Broadcast to DAO room
          this.io.to(`dao:${data.daoId}`).emit('proposal:update', updateData);

          // Send notifications to DAO members
          await this.notificationManager.sendDAONotification(
            data.daoId,
            'proposal_update',
            `Proposal ${data.proposalId} status updated to ${data.status}`,
            updateData
          );
  private findUserIdBySocketId(socketId: string): string | undefined {
    for (const [userId, user] of this.connectedUsers.entries()) {
      if (user.socketId === socketId) {
        return userId;
      }
    }
    return undefined;
  }

  public async sendNotification(userId: string, notification: {
    type: string;
    title: string;
    message: string;
    data?: Record<string, any>;
  }): Promise<void> {
    try {
      const user = this.connectedUsers.get(userId);
      if (user) {
        const createdNotification = await this.notificationManager.createNotification({
          userId,
          type: notification.type as any,
          title: notification.title,
          message: notification.message,
          data: notification.data,
        });
        this.io.to(user.socketId).emit('notification', createdNotification);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new ApiError(500, 'Failed to send notification');
    }
  }

  public async broadcastToDAO(daoId: string, event: string, data: any): Promise<void> {
    try {
      this.io.to(`dao:${daoId}`).emit(event, data);
    } catch (error) {
      console.error('Error broadcasting to DAO:', error);
      throw new ApiError(500, 'Failed to broadcast to DAO');
    }
  }

  public async joinDAO(userId: string, daoId: string): Promise<void> {
    try {
      const user = this.connectedUsers.get(userId);
      if (user) {
        this.io.sockets.sockets.get(user.socketId)?.join(`dao:${daoId}`);
        console.log(`User ${userId} joined DAO ${daoId}`);
      }
    } catch (error) {
      console.error('Error joining DAO:', error);
      throw new ApiError(500, 'Failed to join DAO');
    }
  }

  public async leaveDAO(userId: string, daoId: string): Promise<void> {
    try {
      const user = this.connectedUsers.get(userId);
      if (user) {
        this.io.sockets.sockets.get(user.socketId)?.leave(`dao:${daoId}`);
        console.log(`User ${userId} left DAO ${daoId}`);
      }
    } catch (error) {
      console.error('Error leaving DAO:', error);
      throw new ApiError(500, 'Failed to leave DAO');
    }
  }

  public getConnectedUsers(): number {
    return this.connectedUsers.size;
  }
} 