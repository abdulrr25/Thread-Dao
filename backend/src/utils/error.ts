import { Logger } from './logger';

interface ErrorDetails {
  field?: string;
  message: string;
  code?: string;
  value?: any;
}

export class ApiError extends Error {
  public statusCode: number;
  public details?: ErrorDetails[];
  public isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    details?: ErrorDetails[],
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  public static badRequest(message: string, details?: ErrorDetails[]): ApiError {
    return new ApiError(400, message, details);
  }

  public static unauthorized(message: string, details?: ErrorDetails[]): ApiError {
    return new ApiError(401, message, details);
  }

  public static forbidden(message: string, details?: ErrorDetails[]): ApiError {
    return new ApiError(403, message, details);
  }

  public static notFound(message: string, details?: ErrorDetails[]): ApiError {
    return new ApiError(404, message, details);
  }

  public static conflict(message: string, details?: ErrorDetails[]): ApiError {
    return new ApiError(409, message, details);
  }

  public static tooManyRequests(message: string, details?: ErrorDetails[]): ApiError {
    return new ApiError(429, message, details);
  }

  public static internal(message: string, details?: ErrorDetails[]): ApiError {
    return new ApiError(500, message, details);
  }

  public static notImplemented(message: string, details?: ErrorDetails[]): ApiError {
    return new ApiError(501, message, details);
  }

  public static serviceUnavailable(message: string, details?: ErrorDetails[]): ApiError {
    return new ApiError(503, message, details);
  }
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private logger: Logger;

  private constructor() {
    this.logger = Logger.getInstance();
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  public handleError(error: Error): void {
    if (error instanceof ApiError) {
      this.handleApiError(error);
    } else {
      this.handleUnknownError(error);
    }
  }

  private handleApiError(error: ApiError): void {
    if (error.isOperational) {
      this.logger.warn('Operational error:', {
        statusCode: error.statusCode,
        message: error.message,
        details: error.details,
      });
    } else {
      this.logger.error('Programmer error:', {
        statusCode: error.statusCode,
        message: error.message,
        details: error.details,
        stack: error.stack,
      });
    }
  }

  private handleUnknownError(error: Error): void {
    this.logger.error('Unknown error:', {
      message: error.message,
      stack: error.stack,
    });
  }

  public getErrorResponse(error: Error): {
    statusCode: number;
    message: string;
    details?: ErrorDetails[];
  } {
    if (error instanceof ApiError) {
      return {
        statusCode: error.statusCode,
        message: error.message,
        details: error.details,
      };
    }

    return {
      statusCode: 500,
      message: 'Internal server error',
    };
  }

  public isOperationalError(error: Error): boolean {
    if (error instanceof ApiError) {
      return error.isOperational;
    }
    return false;
  }

  public getErrorStack(error: Error): string | undefined {
    return error.stack;
  }

  public getErrorName(error: Error): string {
    return error.name;
  }

  public getErrorMessage(error: Error): string {
    return error.message;
  }

  public getErrorDetails(error: Error): ErrorDetails[] | undefined {
    if (error instanceof ApiError) {
      return error.details;
    }
    return undefined;
  }

  public getErrorStatusCode(error: Error): number {
    if (error instanceof ApiError) {
      return error.statusCode;
    }
    return 500;
  }

  public getErrorIsOperational(error: Error): boolean {
    if (error instanceof ApiError) {
      return error.isOperational;
    }
    return false;
  }

  public getErrorResponseHeaders(error: Error): Record<string, string> {
    if (error instanceof ApiError) {
      return {
        'Content-Type': 'application/json',
        'X-Error-Code': error.statusCode.toString(),
      };
    }
    return {
      'Content-Type': 'application/json',
    };
  }
} 