import { PrismaClient } from '@prisma/client';
import { ApiError } from './error';
import { Logger } from './logger';

interface DatabaseOptions {
  logQueries?: boolean;
  logErrors?: boolean;
}

export class Database {
  private static instance: Database;
  private prisma: PrismaClient;
  private logger: Logger;
  private logQueries: boolean;
  private logErrors: boolean;

  private constructor(options: DatabaseOptions = {}) {
    this.logger = Logger.getInstance();
    this.logQueries = options.logQueries ?? true;
    this.logErrors = options.logErrors ?? true;

    this.prisma = new PrismaClient({
      log: this.logQueries
        ? [
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
          ]
        : [],
    });

    if (this.logQueries) {
      this.prisma.$on('query', (e) => {
        this.logger.debug('Query:', {
          query: e.query,
          params: e.params,
          duration: e.duration,
        });
      });
    }

    if (this.logErrors) {
      this.prisma.$on('error', (e) => {
        this.logger.error('Database error:', e);
      });
    }
  }

  public static getInstance(options?: DatabaseOptions): Database {
    if (!Database.instance) {
      Database.instance = new Database(options);
    }
    return Database.instance;
  }

  public getPrisma(): PrismaClient {
    return this.prisma;
  }

  public async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      this.logger.info('Database connected');
    } catch (error) {
      this.logger.error('Database connection error:', error);
      throw new ApiError(500, 'Failed to connect to database');
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      this.logger.info('Database disconnected');
    } catch (error) {
      this.logger.error('Database disconnection error:', error);
      throw new ApiError(500, 'Failed to disconnect from database');
    }
  }

  public async transaction<T>(
    fn: (prisma: PrismaClient) => Promise<T>
  ): Promise<T> {
    try {
      return await this.prisma.$transaction(fn);
    } catch (error) {
      this.logger.error('Transaction error:', error);
      throw new ApiError(500, 'Transaction failed');
    }
  }

  public async executeRaw<T>(query: string, ...args: any[]): Promise<T> {
    try {
      return await this.prisma.$executeRawUnsafe(query, ...args);
    } catch (error) {
      this.logger.error('Execute raw query error:', error);
      throw new ApiError(500, 'Failed to execute raw query');
    }
  }

  public async queryRaw<T>(query: string, ...args: any[]): Promise<T> {
    try {
      return await this.prisma.$queryRawUnsafe(query, ...args);
    } catch (error) {
      this.logger.error('Query raw error:', error);
      throw new ApiError(500, 'Failed to execute raw query');
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Health check error:', error);
      return false;
    }
  }

  public async getMetrics(): Promise<any> {
    try {
      return await this.prisma.$metrics.json();
    } catch (error) {
      this.logger.error('Get metrics error:', error);
      throw new ApiError(500, 'Failed to get database metrics');
    }
  }

  public async reset(): Promise<void> {
    try {
      await this.prisma.$reset();
      this.logger.info('Database reset');
    } catch (error) {
      this.logger.error('Reset error:', error);
      throw new ApiError(500, 'Failed to reset database');
    }
  }

  public async seed(): Promise<void> {
    try {
      // Implement your seeding logic here
      this.logger.info('Database seeded');
    } catch (error) {
      this.logger.error('Seed error:', error);
      throw new ApiError(500, 'Failed to seed database');
    }
  }

  public async backup(): Promise<void> {
    try {
      // Implement your backup logic here
      this.logger.info('Database backed up');
    } catch (error) {
      this.logger.error('Backup error:', error);
      throw new ApiError(500, 'Failed to backup database');
    }
  }

  public async restore(): Promise<void> {
    try {
      // Implement your restore logic here
      this.logger.info('Database restored');
    } catch (error) {
      this.logger.error('Restore error:', error);
      throw new ApiError(500, 'Failed to restore database');
    }
  }
} 