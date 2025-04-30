import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Logger } from './logger';
import { ConfigManager } from './config';
import { ApiError } from './error';
import { verify } from 'jsonwebtoken';

interface WebSocketUser {
  id: string;
  socketId: string;
  rooms: Set<string>;
}

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

export class WebSocketManager {
  private static instance: WebSocketManager;
  private logger: Logger;
  private config: ConfigManager;
  private io: Server;
  private users: Map<string, WebSocketUser>;

  private constructor(server: HttpServer) {
    this.logger = Logger.getInstance();
    this.config = ConfigManager.getInstance();
    this.users = new Map();

    this.io = new Server(server, {
      path: this.config.get('websocket.path', '/ws'),
      cors: {
        origin: this.config.get('cors.origin', '*'),
        methods: ['GET', 'POST'],
      },
    });

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
      this.logger.info('WebSocket client connected', { socketId: socket.id });

      socket.on('authenticate', async (token: string) => {
        try {
          const decoded = verify(token, this.config.get('jwt.secret'));
          const userId = (decoded as any).id;

          this.users.set(userId, {
            id: userId,
            socketId: socket.id,
            rooms: new Set(),
          });

          socket.emit('authenticated', { userId });
          this.logger.info('WebSocket client authenticated', { userId, socketId: socket.id });
        } catch (error) {
          this.logger.error('WebSocket authentication error:', error);
          socket.emit('error', { message: 'Authentication failed' });
        }
      });

      socket.on('join', (room: string) => {
        const user = this.getUserBySocketId(socket.id);
        if (user) {
          socket.join(room);
          user.rooms.add(room);
          this.logger.info('WebSocket client joined room', { userId: user.id, room });
        }
      });

      socket.on('leave', (room: string) => {
        const user = this.getUserBySocketId(socket.id);
        if (user) {
          socket.leave(room);
          user.rooms.delete(room);
          this.logger.info('WebSocket client left room', { userId: user.id, room });
        }
      });

      socket.on('message', (message: WebSocketMessage) => {
        const user = this.getUserBySocketId(socket.id);
        if (user) {
          this.broadcastToRoom(message.type, message.data, Array.from(user.rooms));
          this.logger.info('WebSocket message sent', {
            userId: user.id,
            type: message.type,
            rooms: Array.from(user.rooms),
          });
        }
      });

      socket.on('disconnect', () => {
        const user = this.getUserBySocketId(socket.id);
        if (user) {
          this.users.delete(user.id);
          this.logger.info('WebSocket client disconnected', { userId: user.id });
        }
      });
    });
  }

  private getUserBySocketId(socketId: string): WebSocketUser | undefined {
    return Array.from(this.users.values()).find((user) => user.socketId === socketId);
  }

  public broadcastToRoom(type: string, data: any, rooms: string[]): void {
    const message: WebSocketMessage = {
      type,
      data,
      timestamp: Date.now(),
    };

    rooms.forEach((room) => {
      this.io.to(room).emit(type, message);
    });
  }

  public sendToUser(userId: string, type: string, data: any): void {
    const user = this.users.get(userId);
    if (user) {
      const message: WebSocketMessage = {
        type,
        data,
        timestamp: Date.now(),
      };
      this.io.to(user.socketId).emit(type, message);
    }
  }

  public sendToUsers(userIds: string[], type: string, data: any): void {
    userIds.forEach((userId) => this.sendToUser(userId, type, data));
  }

  public broadcastToAll(type: string, data: any): void {
    const message: WebSocketMessage = {
      type,
      data,
      timestamp: Date.now(),
    };
    this.io.emit(type, message);
  }

  public getConnectedUsers(): string[] {
    return Array.from(this.users.keys());
  }

  public getUserRooms(userId: string): string[] {
    const user = this.users.get(userId);
    return user ? Array.from(user.rooms) : [];
  }

  public isUserConnected(userId: string): boolean {
    return this.users.has(userId);
  }

  public getRoomUsers(room: string): string[] {
    const roomUsers = new Set<string>();
    this.users.forEach((user) => {
      if (user.rooms.has(room)) {
        roomUsers.add(user.id);
      }
    });
    return Array.from(roomUsers);
  }

  public disconnectUser(userId: string): void {
    const user = this.users.get(userId);
    if (user) {
      this.io.sockets.sockets.get(user.socketId)?.disconnect();
      this.users.delete(userId);
    }
  }

  public disconnectAll(): void {
    this.io.disconnectSockets();
    this.users.clear();
  }

  public getServer(): Server {
    return this.io;
  }
} 