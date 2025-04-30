import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../lib/errors';
import { logger } from '../lib/logger';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
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
        return res.status(400).json({
          error: 'Validation error',
          details: errors,
        });
      }
      logger.error('Unexpected validation error', {
        path: req.path,
        method: req.method,
        error,
      });
      next(error);
    }
  };
};

// Common validation schemas
export const paginationSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(Number),
    limit: z.string().optional().transform(Number),
  }),
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const walletAddressSchema = z.object({
  params: z.object({
    address: z.string().regex(/^[0-9a-fA-F]{40}$/),
  }),
}); 