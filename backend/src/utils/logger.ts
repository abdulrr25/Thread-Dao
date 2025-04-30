import winston from 'winston';
import { ConfigManager } from './config';

interface LogOptions {
  level?: string;
  format?: winston.Logform.Format;
  transports?: winston.transport[];
  defaultMeta?: Record<string, any>;
}

export class Logger {
  private static instance: Logger;
  private logger: winston.Logger;
  private config: ConfigManager;
  private defaultOptions: LogOptions = {
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
      }),
    ],
    defaultMeta: { service: 'thread-dao-api' },
  };

  private constructor() {
    this.config = ConfigManager.getInstance();
    this.logger = this.createLogger();
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private createLogger(options: LogOptions = {}): winston.Logger {
    const mergedOptions = { ...this.defaultOptions, ...options };
    return winston.createLogger(mergedOptions);
  }

  public error(message: string, meta?: Record<string, any>): void {
    this.logger.error(message, { ...meta });
  }

  public warn(message: string, meta?: Record<string, any>): void {
    this.logger.warn(message, { ...meta });
  }

  public info(message: string, meta?: Record<string, any>): void {
    this.logger.info(message, { ...meta });
  }

  public debug(message: string, meta?: Record<string, any>): void {
    this.logger.debug(message, { ...meta });
  }

  public http(message: string, meta?: Record<string, any>): void {
    this.logger.http(message, { ...meta });
  }

  public verbose(message: string, meta?: Record<string, any>): void {
    this.logger.verbose(message, { ...meta });
  }

  public silly(message: string, meta?: Record<string, any>): void {
    this.logger.silly(message, { ...meta });
  }

  public log(level: string, message: string, meta?: Record<string, any>): void {
    this.logger.log(level, message, { ...meta });
  }

  public addTransport(transport: winston.transport): void {
    this.logger.add(transport);
  }

  public removeTransport(transport: winston.transport): void {
    this.logger.remove(transport);
  }

  public setLevel(level: string): void {
    this.logger.level = level;
  }

  public getLevel(): string {
    return this.logger.level;
  }

  public getLogger(): winston.Logger {
    return this.logger;
  }

  public createChildLogger(options: LogOptions = {}): winston.Logger {
    return this.logger.child(options);
  }

  public createRequestLogger(): winston.Logger {
    return this.createChildLogger({
      defaultMeta: {
        service: 'thread-dao-api',
        type: 'request',
      },
    });
  }

  public createErrorLogger(): winston.Logger {
    return this.createChildLogger({
      defaultMeta: {
        service: 'thread-dao-api',
        type: 'error',
      },
    });
  }

  public createAccessLogger(): winston.Logger {
    return this.createChildLogger({
      defaultMeta: {
        service: 'thread-dao-api',
        type: 'access',
      },
    });
  }

  public createAuditLogger(): winston.Logger {
    return this.createChildLogger({
      defaultMeta: {
        service: 'thread-dao-api',
        type: 'audit',
      },
    });
  }

  public createSecurityLogger(): winston.Logger {
    return this.createChildLogger({
      defaultMeta: {
        service: 'thread-dao-api',
        type: 'security',
      },
    });
  }

  public createPerformanceLogger(): winston.Logger {
    return this.createChildLogger({
      defaultMeta: {
        service: 'thread-dao-api',
        type: 'performance',
      },
    });
  }

  public createBusinessLogger(): winston.Logger {
    return this.createChildLogger({
      defaultMeta: {
        service: 'thread-dao-api',
        type: 'business',
      },
    });
  }

  public createSystemLogger(): winston.Logger {
    return this.createChildLogger({
      defaultMeta: {
        service: 'thread-dao-api',
        type: 'system',
      },
    });
  }
} 