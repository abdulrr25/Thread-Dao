import { Request, Response, NextFunction } from 'express';
import { z, AnyZodObject, ZodError } from 'zod';
import { ApiError } from '../utils/error';
import { logger } from '../utils/logger';

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
        const errorMessage = error.errors
          .map((err) => err.message)
          .join(', ');
        return next(new ApiError(400, errorMessage));
      }
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