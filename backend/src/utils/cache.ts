import Redis from 'ioredis';
import { Logger } from './logger';
import { ApiError } from './error';
import { ConfigManager } from './config';

interface CacheOptions {
  ttl?: number;
  prefix?: string;
}

interface CacheData<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class Cache {
  private static instance: Cache;
  private logger: Logger;
  private config: ConfigManager;
  private client: Redis;
  private defaultTTL: number = 3600; // 1 hour
  private defaultPrefix: string = 'cache:';

  private constructor() {
    this.logger = Logger.getInstance();
    this.config = ConfigManager.getInstance();
    this.client = new Redis(this.config.get('redis.url'));
  }

  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  public async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    try {
      const fullKey = this.getFullKey(key, options.prefix);
      const data = await this.client.get(fullKey);

      if (!data) {
        return null;
      }

      const cacheData: CacheData<T> = JSON.parse(data);
      const now = Date.now();

      // Check if data is expired
      if (cacheData.ttl > 0 && now - cacheData.timestamp > cacheData.ttl * 1000) {
        await this.del(key, options);
        return null;
      }

      return cacheData.data;
    } catch (error) {
      this.logger.error('Cache get error:', error);
      throw new ApiError(500, 'Cache error');
    }
  }

  public async set<T>(
    key: string,
    value: T,
    options: CacheOptions = {}
  ): Promise<void> {
    try {
      const fullKey = this.getFullKey(key, options.prefix);
      const ttl = options.ttl || this.defaultTTL;
      const cacheData: CacheData<T> = {
        data: value,
        timestamp: Date.now(),
        ttl,
      };

      await this.client.set(fullKey, JSON.stringify(cacheData), 'EX', ttl);
    } catch (error) {
      this.logger.error('Cache set error:', error);
      throw new ApiError(500, 'Cache error');
    }
  }

  public async del(key: string, options: CacheOptions = {}): Promise<void> {
    try {
      const fullKey = this.getFullKey(key, options.prefix);
      await this.client.del(fullKey);
    } catch (error) {
      this.logger.error('Cache delete error:', error);
      throw new ApiError(500, 'Cache error');
    }
  }

  public async exists(key: string, options: CacheOptions = {}): Promise<boolean> {
    try {
      const fullKey = this.getFullKey(key, options.prefix);
      const exists = await this.client.exists(fullKey);
      return exists === 1;
    } catch (error) {
      this.logger.error('Cache exists error:', error);
      throw new ApiError(500, 'Cache error');
    }
  }

  public async ttl(key: string, options: CacheOptions = {}): Promise<number> {
    try {
      const fullKey = this.getFullKey(key, options.prefix);
      return await this.client.ttl(fullKey);
    } catch (error) {
      this.logger.error('Cache ttl error:', error);
      throw new ApiError(500, 'Cache error');
    }
  }

  public async flush(options: CacheOptions = {}): Promise<void> {
    try {
      const pattern = this.getFullKey('*', options.prefix);
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error) {
      this.logger.error('Cache flush error:', error);
      throw new ApiError(500, 'Cache error');
    }
  }

  public async increment(key: string, options: CacheOptions = {}): Promise<number> {
    try {
      const fullKey = this.getFullKey(key, options.prefix);
      return await this.client.incr(fullKey);
    } catch (error) {
      this.logger.error('Cache increment error:', error);
      throw new ApiError(500, 'Cache error');
    }
  }

  public async decrement(key: string, options: CacheOptions = {}): Promise<number> {
    try {
      const fullKey = this.getFullKey(key, options.prefix);
      return await this.client.decr(fullKey);
    } catch (error) {
      this.logger.error('Cache decrement error:', error);
      throw new ApiError(500, 'Cache error');
    }
  }

  public async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    try {
      const cached = await this.get<T>(key, options);
      if (cached !== null) {
        return cached;
      }

      const data = await fetchFn();
      await this.set(key, data, options);
      return data;
    } catch (error) {
      this.logger.error('Cache getOrSet error:', error);
      throw new ApiError(500, 'Cache error');
    }
  }

  private getFullKey(key: string, prefix?: string): string {
    return `${prefix || this.defaultPrefix}${key}`;
  }

  public async quit(): Promise<void> {
    try {
      await this.client.quit();
    } catch (error) {
      this.logger.error('Cache quit error:', error);
      throw new ApiError(500, 'Cache error');
    }
  }
} 
} 