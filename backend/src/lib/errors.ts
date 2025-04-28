export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(401, message);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Not authorized') {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed') {
    super(500, message);
  }
}

export class ExternalServiceError extends AppError {
  constructor(message = 'External service error') {
    super(502, message);
  }
} 