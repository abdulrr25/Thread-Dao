import { PrismaClient } from '@prisma/client';
import { Logger } from './logger';
import { ConfigManager } from './config';
import { ApiError } from './error';

export class Database {
  private static instance: Database;
  private logger: Logger;
  private config: ConfigManager;
  private client: PrismaClient;

  private constructor() {
    this.logger = Logger.getInstance();
    this.config = ConfigManager.getInstance();
    this.client = new PrismaClient({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });

    this.setupEventHandlers();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private setupEventHandlers(): void {
    this.client.$on('query', (e: any) => {
      this.logger.debug('Query:', {
        query: e.query,
        params: e.params,
        duration: e.duration,
      });
    });

    this.client.$on('error', (e: any) => {
      this.logger.error('Database error:', {
        error: e.message,
        target: e.target,
      });
    });

    this.client.$on('info', (e: any) => {
      this.logger.info('Database info:', {
        message: e.message,
        target: e.target,
      });
    });

    this.client.$on('warn', (e: any) => {
      this.logger.warn('Database warning:', {
        message: e.message,
        target: e.target,
      });
    });
  }

  public async connect(): Promise<void> {
    try {
      await this.client.$connect();
      this.logger.info('Database connected');
    } catch (error) {
      this.logger.error('Database connection error:', error);
      throw new ApiError(500, 'Database connection failed');
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.client.$disconnect();
      this.logger.info('Database disconnected');
    } catch (error) {
      this.logger.error('Database disconnection error:', error);
      throw new ApiError(500, 'Database disconnection failed');
    }
  }

  public async transaction<T>(
    fn: (tx: PrismaClient) => Promise<T>
  ): Promise<T> {
    try {
      return await this.client.$transaction(fn);
    } catch (error) {
      this.logger.error('Database transaction error:', error);
      throw new ApiError(500, 'Database transaction failed');
    }
  }

  public async query<T>(
    fn: (tx: PrismaClient) => Promise<T>
  ): Promise<T> {
    try {
      return await fn(this.client);
    } catch (error) {
      this.logger.error('Database query error:', error);
      throw new ApiError(500, 'Database query failed');
    }
  }

  public getClient(): PrismaClient {
    return this.client;
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.client.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Database health check failed:', error);
      return false;
    }
  }

  public async executeRaw<T>(query: string, ...args: any[]): Promise<T> {
    try {
      return await this.client.$executeRawUnsafe(query, ...args);
    } catch (error) {
      this.logger.error('Database raw query error:', error);
      throw new ApiError(500, 'Database raw query failed');
    }
  }

  public async queryRaw<T>(query: string, ...args: any[]): Promise<T> {
    try {
      return await this.client.$queryRawUnsafe(query, ...args);
    } catch (error) {
      this.logger.error('Database raw query error:', error);
      throw new ApiError(500, 'Database raw query failed');
    }
  }

  public async create<T>(
    model: string,
    data: any,
    include?: any
  ): Promise<T> {
    try {
      return await (this.client as any)[model].create({
        data,
        include,
      });
    } catch (error) {
      this.logger.error('Database create error:', error);
      throw new ApiError(500, 'Database create failed');
    }
  }

  public async findUnique<T>(
    model: string,
    where: any,
    include?: any
  ): Promise<T | null> {
    try {
      return await (this.client as any)[model].findUnique({
        where,
        include,
      });
    } catch (error) {
      this.logger.error('Database findUnique error:', error);
      throw new ApiError(500, 'Database findUnique failed');
    }
  }

  public async findFirst<T>(
    model: string,
    where: any,
    include?: any
  ): Promise<T | null> {
    try {
      return await (this.client as any)[model].findFirst({
        where,
        include,
      });
    } catch (error) {
      this.logger.error('Database findFirst error:', error);
      throw new ApiError(500, 'Database findFirst failed');
    }
  }

  public async findMany<T>(
    model: string,
    where?: any,
    include?: any,
    orderBy?: any,
    skip?: number,
    take?: number
  ): Promise<T[]> {
    try {
      return await (this.client as any)[model].findMany({
        where,
        include,
        orderBy,
        skip,
        take,
      });
    } catch (error) {
      this.logger.error('Database findMany error:', error);
      throw new ApiError(500, 'Database findMany failed');
    }
  }

  public async update<T>(
    model: string,
    where: any,
    data: any,
    include?: any
  ): Promise<T> {
    try {
      return await (this.client as any)[model].update({
        where,
        data,
        include,
      });
    } catch (error) {
      this.logger.error('Database update error:', error);
      throw new ApiError(500, 'Database update failed');
    }
  }

  public async delete<T>(
    model: string,
    where: any
  ): Promise<T> {
    try {
      return await (this.client as any)[model].delete({
        where,
      });
    } catch (error) {
      this.logger.error('Database delete error:', error);
      throw new ApiError(500, 'Database delete failed');
    }
  }

  public async count(
    model: string,
    where?: any
  ): Promise<number> {
    try {
      return await (this.client as any)[model].count({
        where,
      });
    } catch (error) {
      this.logger.error('Database count error:', error);
      throw new ApiError(500, 'Database count failed');
    }
  }

  public async aggregate<T>(
    model: string,
    args: any
  ): Promise<T> {
    try {
      return await (this.client as any)[model].aggregate(args);
    } catch (error) {
      this.logger.error('Database aggregate error:', error);
      throw new ApiError(500, 'Database aggregate failed');
    }
  }

  public async groupBy<T>(
    model: string,
    args: any
  ): Promise<T[]> {
    try {
      return await (this.client as any)[model].groupBy(args);
    } catch (error) {
      this.logger.error('Database groupBy error:', error);
      throw new ApiError(500, 'Database groupBy failed');
    }
  }
} 