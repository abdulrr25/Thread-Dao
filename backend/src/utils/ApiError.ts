export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (error: Error) => {
  if (error instanceof ApiError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
      isOperational: error.isOperational,
    };
  }

  // Handle unexpected errors
  return {
    statusCode: 500,
    message: 'Internal server error',
    isOperational: false,
  };
};

export class ValidationError extends ApiError {
  errors: any;

  constructor(message: string, errors: any) {
    super(400, message);
    this.errors = errors;
  }
} 