import dotenv from 'dotenv';
import path from 'path';
import { Logger } from './logger';

interface ConfigOptions {
  env?: string;
  configDir?: string;
  configFile?: string;
}

export class ConfigManager {
  private static instance: ConfigManager;
  private logger: Logger;
  private config: Record<string, any>;
  private defaultOptions: ConfigOptions = {
    env: process.env.NODE_ENV || 'development',
    configDir: 'config',
    configFile: 'config.json',
  };

  private constructor(options: ConfigOptions = {}) {
    this.logger = Logger.getInstance();
    this.config = this.loadConfig(options);
  }

  public static getInstance(options?: ConfigOptions): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager(options);
    }
    return ConfigManager.instance;
  }

  private loadConfig(options: ConfigOptions = {}): Record<string, any> {
    try {
      const mergedOptions = { ...this.defaultOptions, ...options };
      const envFile = `.env.${mergedOptions.env}`;
      const configPath = path.resolve(
        process.cwd(),
        mergedOptions.configDir || '',
        mergedOptions.configFile || ''
      );

      // Load environment variables
      dotenv.config({ path: envFile });
      dotenv.config();

      // Load configuration file
      const config = require(configPath);

      // Merge environment variables with config
      const mergedConfig = {
        ...config,
        env: mergedOptions.env,
        port: process.env.PORT || config.port || 3000,
        host: process.env.HOST || config.host || 'localhost',
        database: {
          ...config.database,
          url: process.env.DATABASE_URL || config.database?.url,
        },
        jwt: {
          ...config.jwt,
          secret: process.env.JWT_SECRET || config.jwt?.secret,
          expiresIn: process.env.JWT_EXPIRES_IN || config.jwt?.expiresIn,
        },
        cors: {
          ...config.cors,
          origin: process.env.CORS_ORIGIN || config.cors?.origin,
        },
        logging: {
          ...config.logging,
          level: process.env.LOG_LEVEL || config.logging?.level,
        },
        rateLimit: {
          ...config.rateLimit,
          windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '') || config.rateLimit?.windowMs,
          max: parseInt(process.env.RATE_LIMIT_MAX || '') || config.rateLimit?.max,
        },
        cache: {
          ...config.cache,
          ttl: parseInt(process.env.CACHE_TTL || '') || config.cache?.ttl,
        },
        ai: {
          ...config.ai,
          apiKey: process.env.AI_API_KEY || config.ai?.apiKey,
          model: process.env.AI_MODEL || config.ai?.model,
        },
        websocket: {
          ...config.websocket,
          path: process.env.WS_PATH || config.websocket?.path,
        },
      };

      this.logger.info('Configuration loaded', { env: mergedOptions.env });
      return mergedConfig;
    } catch (error) {
      this.logger.error('Error loading configuration:', error);
      throw error;
    }
  }

  public get<T = any>(key: string, defaultValue?: T): T {
    try {
      const value = key.split('.').reduce((obj, k) => obj?.[k], this.config);
      return value !== undefined ? value : defaultValue;
    } catch (error) {
      this.logger.error('Error getting configuration value:', { key, error });
      return defaultValue;
    }
  }

  public set<T = any>(key: string, value: T): void {
    try {
      const keys = key.split('.');
      const lastKey = keys.pop();
      const obj = keys.reduce((o, k) => (o[k] = o[k] || {}), this.config);
      if (lastKey) {
        obj[lastKey] = value;
      }
    } catch (error) {
      this.logger.error('Error setting configuration value:', { key, value, error });
      throw error;
    }
  }

  public has(key: string): boolean {
    try {
      return key.split('.').reduce((obj, k) => obj?.[k], this.config) !== undefined;
    } catch (error) {
      this.logger.error('Error checking configuration key:', { key, error });
      return false;
    }
  }

  public delete(key: string): void {
    try {
      const keys = key.split('.');
      const lastKey = keys.pop();
      const obj = keys.reduce((o, k) => o?.[k], this.config);
      if (obj && lastKey) {
        delete obj[lastKey];
      }
    } catch (error) {
      this.logger.error('Error deleting configuration key:', { key, error });
      throw error;
    }
  }

  public getEnv(): string {
    return this.get('env', 'development');
  }

  public isDevelopment(): boolean {
    return this.getEnv() === 'development';
  }

  public isProduction(): boolean {
    return this.getEnv() === 'production';
  }

  public isTest(): boolean {
    return this.getEnv() === 'test';
  }

  public getPort(): number {
    return this.get('port', 3000);
  }

  public getHost(): string {
    return this.get('host', 'localhost');
  }

  public getDatabaseUrl(): string {
    return this.get('database.url');
  }

  public getJwtSecret(): string {
    return this.get('jwt.secret');
  }

  public getJwtExpiresIn(): string {
    return this.get('jwt.expiresIn', '1d');
  }

  public getCorsOrigin(): string | string[] {
    return this.get('cors.origin', '*');
  }

  public getLogLevel(): string {
    return this.get('logging.level', 'info');
  }

  public getRateLimitWindowMs(): number {
    return this.get('rateLimit.windowMs', 15 * 60 * 1000);
  }

  public getRateLimitMax(): number {
    return this.get('rateLimit.max', 100);
  }

  public getCacheTtl(): number {
    return this.get('cache.ttl', 3600);
  }

  public getAiApiKey(): string {
    return this.get('ai.apiKey');
  }

  public getAiModel(): string {
    return this.get('ai.model', 'gpt-4');
  }

  public getWsPath(): string {
    return this.get('websocket.path', '/ws');
  }
} 