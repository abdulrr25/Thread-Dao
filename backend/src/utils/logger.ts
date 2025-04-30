import winston from 'winston';
import { format } from 'winston';

const { combine, timestamp, printf, colorize } = format;

interface LoggerOptions {
  level?: string;
  filename?: string;
}

export class Logger {
  private static instance: Logger;
  private logger: winston.Logger;

  private constructor(options: LoggerOptions = {}) {
    const { level = 'info', filename } = options;

    const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
      let msg = `${timestamp} [${level}]: ${message}`;
      if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
      }
      return msg;
    });

    const transports: winston.transport[] = [
      new winston.transports.Console({
        format: combine(colorize(), timestamp(), logFormat),
      }),
    ];

    if (filename) {
      transports.push(
        new winston.transports.File({
          filename,
          format: combine(timestamp(), logFormat),
        })
      );
    }

    this.logger = winston.createLogger({
      level,
      format: combine(timestamp(), logFormat),
      transports,
    });
  }

  public static getInstance(options?: LoggerOptions): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(options);
    }
    return Logger.instance;
  }

  public error(message: string, meta?: any): void {
    this.logger.error(message, meta);
  }

  public warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  public info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  public debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  public http(message: string, meta?: any): void {
    this.logger.http(message, meta);
  }

  public verbose(message: string, meta?: any): void {
    this.logger.verbose(message, meta);
  }

  public silly(message: string, meta?: any): void {
    this.logger.silly(message, meta);
  }

  public log(level: string, message: string, meta?: any): void {
    this.logger.log(level, message, meta);
  }

  public stream(): { write: (message: string) => void } {
    return {
      write: (message: string) => {
        this.info(message.trim());
      },
    };
  }
} 