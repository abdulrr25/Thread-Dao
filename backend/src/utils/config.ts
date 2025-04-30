import dotenv from 'dotenv';
import { Logger } from './logger';

interface DatabaseConfig {
  url: string;
  logQueries: boolean;
  logErrors: boolean;
}

interface SecurityConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  saltRounds: number;
  corsOrigin: string[];
}

interface ServerConfig {
  port: number;
  host: string;
  env: string;
  baseUrl: string;
}

interface RedisConfig {
  url: string;
  ttl: number;
}

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

interface Config {
  database: DatabaseConfig;
  security: SecurityConfig;
  server: ServerConfig;
  redis: RedisConfig;
  email: EmailConfig;
}

export class ConfigManager {
  private static instance: ConfigManager;
  private config: Config;
  private logger: Logger;

  private constructor() {
    this.logger = Logger.getInstance();
    dotenv.config();
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): Config {
    return {
      database: {
        url: this.getRequiredEnv('DATABASE_URL'),
        logQueries: this.getBoolEnv('DATABASE_LOG_QUERIES', true),
        logErrors: this.getBoolEnv('DATABASE_LOG_ERRORS', true),
      },
      security: {
        jwtSecret: this.getRequiredEnv('JWT_SECRET'),
        jwtExpiresIn: this.getEnv('JWT_EXPIRES_IN', '1d'),
        saltRounds: this.getIntEnv('SALT_ROUNDS', 10),
        corsOrigin: this.getArrayEnv('CORS_ORIGIN', ['http://localhost:3000']),
      },
      server: {
        port: this.getIntEnv('PORT', 3000),
        host: this.getEnv('HOST', 'localhost'),
        env: this.getEnv('NODE_ENV', 'development'),
        baseUrl: this.getEnv('BASE_URL', 'http://localhost:3000'),
      },
      redis: {
        url: this.getRequiredEnv('REDIS_URL'),
        ttl: this.getIntEnv('REDIS_TTL', 3600),
      },
      email: {
        host: this.getRequiredEnv('EMAIL_HOST'),
        port: this.getIntEnv('EMAIL_PORT', 587),
        secure: this.getBoolEnv('EMAIL_SECURE', false),
        auth: {
          user: this.getRequiredEnv('EMAIL_USER'),
          pass: this.getRequiredEnv('EMAIL_PASS'),
        },
        from: this.getRequiredEnv('EMAIL_FROM'),
      },
    };
  }

  private getEnv(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
  }

  private getRequiredEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
      this.logger.error(`Missing required environment variable: ${key}`);
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }

  private getIntEnv(key: string, defaultValue: number): number {
    const value = process.env[key];
    if (!value) {
      return defaultValue;
    }
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      this.logger.warn(
        `Invalid integer environment variable: ${key}, using default: ${defaultValue}`
      );
      return defaultValue;
    }
    return parsed;
  }

  private getBoolEnv(key: string, defaultValue: boolean): boolean {
    const value = process.env[key];
    if (!value) {
      return defaultValue;
    }
    return value.toLowerCase() === 'true';
  }

  private getArrayEnv(key: string, defaultValue: string[]): string[] {
    const value = process.env[key];
    if (!value) {
      return defaultValue;
    }
    return value.split(',').map((item) => item.trim());
  }

  public getConfig(): Config {
    return this.config;
  }

  public getDatabaseConfig(): DatabaseConfig {
    return this.config.database;
  }

  public getSecurityConfig(): SecurityConfig {
    return this.config.security;
  }

  public getServerConfig(): ServerConfig {
    return this.config.server;
  }

  public getRedisConfig(): RedisConfig {
    return this.config.redis;
  }

  public getEmailConfig(): EmailConfig {
    return this.config.email;
  }

  public isDevelopment(): boolean {
    return this.config.server.env === 'development';
  }

  public isProduction(): boolean {
    return this.config.server.env === 'production';
  }

  public isTest(): boolean {
    return this.config.server.env === 'test';
  }
} 