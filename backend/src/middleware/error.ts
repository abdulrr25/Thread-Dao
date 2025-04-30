import { Request, Response, NextFunction } from 'express';
import { ApiError, handleError } from '../utils/ApiError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = handleError(err);

  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    ...error,
  });

  // Send error response
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
}; 