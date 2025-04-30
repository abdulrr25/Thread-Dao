import { Logger } from './logger';
import { ApiError } from './error';
import { ConfigManager } from './config';
import { Cache } from './cache';
import { Request, Response, NextFunction } from 'express';

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  statusCode?: number;
  keyPrefix?: string;
}

interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

export class RateLimiter {
  private static instance: RateLimiter;
  private logger: Logger;
  private config: ConfigManager;
  private cache: Cache;
  private defaultOptions: RateLimitOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
    statusCode: 429,
    keyPrefix: 'ratelimit:',
  };

  private constructor() {
    this.logger = Logger.getInstance();
    this.config = ConfigManager.getInstance();
    this.cache = Cache.getInstance();
  }

  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  public async check(
    key: string,
    options: Partial<RateLimitOptions> = {}
  ): Promise<RateLimitInfo> {
    try {
      const mergedOptions = { ...this.defaultOptions, ...options };
      const fullKey = this.getFullKey(key, mergedOptions.keyPrefix);
      const now = Date.now();
      const windowStart = now - mergedOptions.windowMs;

      // Get current count
      const count = await this.cache.increment(fullKey, {
        prefix: mergedOptions.keyPrefix,
      });

      // Set expiry if this is the first request
      if (count === 1) {
        await this.cache.set(
          `${fullKey}:reset`,
          now + mergedOptions.windowMs,
          { prefix: mergedOptions.keyPrefix }
        );
      }

      // Get reset time
      const reset = await this.cache.get<number>(`${fullKey}:reset`, {
        prefix: mergedOptions.keyPrefix,
      }) || now + mergedOptions.windowMs;

      // Calculate remaining requests
      const remaining = Math.max(0, mergedOptions.max - count);

      return {
        limit: mergedOptions.max,
        remaining,
        reset,
      };
    } catch (error) {
      this.logger.error('Rate limiter check error:', error);
      throw new ApiError(500, 'Rate limit check failed');
    }
  }

  public async isRateLimited(
    key: string,
    options: Partial<RateLimitOptions> = {}
  ): Promise<boolean> {
    try {
      const info = await this.check(key, options);
      return info.remaining <= 0;
    } catch (error) {
      this.logger.error('Rate limiter isRateLimited error:', error);
      return false;
    }
  }

  public async getRateLimitInfo(
    key: string,
    options: Partial<RateLimitOptions> = {}
  ): Promise<RateLimitInfo> {
    try {
      const mergedOptions = { ...this.defaultOptions, ...options };
      const fullKey = this.getFullKey(key, mergedOptions.keyPrefix);
      const count = await this.cache.get<number>(fullKey, {
        prefix: mergedOptions.keyPrefix,
      }) || 0;
      const reset = await this.cache.get<number>(`${fullKey}:reset`, {
        prefix: mergedOptions.keyPrefix,
      }) || Date.now() + mergedOptions.windowMs;

      return {
        limit: mergedOptions.max,
        remaining: Math.max(0, mergedOptions.max - count),
        reset,
      };
    } catch (error) {
      this.logger.error('Rate limiter getRateLimitInfo error:', error);
      throw new ApiError(500, 'Rate limit info check failed');
    }
  }

  public async reset(key: string, options: Partial<RateLimitOptions> = {}): Promise<void> {
    try {
      const mergedOptions = { ...this.defaultOptions, ...options };
      const fullKey = this.getFullKey(key, mergedOptions.keyPrefix);
      await this.cache.del(fullKey, { prefix: mergedOptions.keyPrefix });
      await this.cache.del(`${fullKey}:reset`, { prefix: mergedOptions.keyPrefix });
    } catch (error) {
      this.logger.error('Rate limiter reset error:', error);
      throw new ApiError(500, 'Rate limit reset failed');
    }
  }

  public async decrement(key: string, options: Partial<RateLimitOptions> = {}): Promise<void> {
    try {
      const mergedOptions = { ...this.defaultOptions, ...options };
      const fullKey = this.getFullKey(key, mergedOptions.keyPrefix);
      await this.cache.decrement(fullKey, { prefix: mergedOptions.keyPrefix });
    } catch (error) {
      this.logger.error('Rate limiter decrement error:', error);
      throw new ApiError(500, 'Rate limit decrement failed');
    }
  }

  private getFullKey(key: string, prefix?: string): string {
    return `${prefix || this.defaultOptions.keyPrefix}${key}`;
  }

  public getMiddleware(options: Partial<RateLimitOptions> = {}) {
    return async (req: any, res: any, next: any) => {
      try {
        const key = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        const info = await this.check(key, options);

        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', info.limit);
        res.setHeader('X-RateLimit-Remaining', info.remaining);
        res.setHeader('X-RateLimit-Reset', info.reset);

        if (info.remaining <= 0) {
          const mergedOptions = { ...this.defaultOptions, ...options };
          throw new ApiError(
            mergedOptions.statusCode || 429,
            mergedOptions.message || 'Too many requests'
          );
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }
} 