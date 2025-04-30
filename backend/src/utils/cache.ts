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
  private cache: Map<string, CacheData<any>>;
  private defaultTTL: number = 3600; // 1 hour
  private defaultPrefix: string = 'cache:';

  private constructor() {
    this.logger = Logger.getInstance();
    this.config = ConfigManager.getInstance();
    this.cache = new Map();
  }

  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  private getFullKey(key: string, prefix?: string): string {
    return `${prefix || this.defaultPrefix}${key}`;
  }

  public async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    try {
      const fullKey = this.getFullKey(key, options.prefix);
      const cacheData = this.cache.get(fullKey);

      if (!cacheData) {
        return null;
      }

      const now = Date.now();

      // Check if data is expired
      if (cacheData.ttl > 0 && now - cacheData.timestamp > cacheData.ttl * 1000) {
        this.cache.delete(fullKey);
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

      this.cache.set(fullKey, cacheData);
    } catch (error) {
      this.logger.error('Cache set error:', error);
      throw new ApiError(500, 'Cache error');
    }
  }

  public async del(key: string, options: CacheOptions = {}): Promise<void> {
    try {
      const fullKey = this.getFullKey(key, options.prefix);
      this.cache.delete(fullKey);
    } catch (error) {
      this.logger.error('Cache delete error:', error);
      throw new ApiError(500, 'Cache error');
    }
  }

  public async exists(key: string, options: CacheOptions = {}): Promise<boolean> {
    try {
      const fullKey = this.getFullKey(key, options.prefix);
      return this.cache.has(fullKey);
    } catch (error) {
      this.logger.error('Cache exists error:', error);
      throw new ApiError(500, 'Cache error');
    }
  }

  public async ttl(key: string, options: CacheOptions = {}): Promise<number> {
    try {
      const fullKey = this.getFullKey(key, options.prefix);
      const cacheData = this.cache.get(fullKey);
      if (!cacheData) return -2;
      if (cacheData.ttl === 0) return -1;
      const now = Date.now();
      const remaining = cacheData.ttl - (now - cacheData.timestamp) / 1000;
      return Math.max(0, Math.floor(remaining));
    } catch (error) {
      this.logger.error('Cache ttl error:', error);
      throw new ApiError(500, 'Cache error');
    }
  }

  public async flush(options: CacheOptions = {}): Promise<void> {
    try {
      const prefix = options.prefix || this.defaultPrefix;
      for (const key of this.cache.keys()) {
        if (key.startsWith(prefix)) {
          this.cache.delete(key);
        }
      }
    } catch (error) {
      this.logger.error('Cache flush error:', error);
      throw new ApiError(500, 'Cache error');
    }
  }

  public async increment(key: string, options: CacheOptions = {}): Promise<number> {
    try {
      const fullKey = this.getFullKey(key, options.prefix);
      const currentValue = await this.get<number>(key, options) || 0;
      const newValue = currentValue + 1;
      await this.set(key, newValue, options);
      return newValue;
    } catch (error) {
      this.logger.error('Cache increment error:', error);
      throw new ApiError(500, 'Cache error');
    }
  }

  public async decrement(key: string, options: CacheOptions = {}): Promise<number> {
    try {
      const fullKey = this.getFullKey(key, options.prefix);
      const currentValue = await this.get<number>(key, options) || 0;
      const newValue = Math.max(0, currentValue - 1);
      await this.set(key, newValue, options);
      return newValue;
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

  public async quit(): Promise<void> {
    try {
      this.cache.clear();
    } catch (error) {
      this.logger.error('Cache quit error:', error);
      throw new ApiError(500, 'Cache error');
    }
  }
} 
} 