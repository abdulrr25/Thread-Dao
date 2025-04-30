import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../lib/errors';
import { logger } from '../lib/logger';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Update request with validated data
      req.body = result.body;
      req.query = result.query;
      req.params = result.params;

      logger.info('Validation successful', {
        path: req.path,
        method: req.method,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        logger.warn('Validation failed', {
          path: req.path,
          method: req.method,
          errors,
        });
        next(new ValidationError(JSON.stringify(errors)));
      } else {
        logger.error('Unexpected validation error', {
          path: req.path,
          method: req.method,
          error,
        });
        next(error);
      }
    }
  };
}; 