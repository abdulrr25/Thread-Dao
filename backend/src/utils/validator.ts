import Joi from 'joi';
import { Logger } from './logger';
import { ApiError } from './error';
import { Request, Response, NextFunction } from 'express';

interface ValidationOptions {
  abortEarly?: boolean;
  allowUnknown?: boolean;
  stripUnknown?: boolean;
}

interface ValidationSchema {
  body?: Joi.Schema;
  query?: Joi.Schema;
  params?: Joi.Schema;
  headers?: Joi.Schema;
}

export class Validator {
  private static instance: Validator;
  private logger: Logger;
  private defaultOptions: ValidationOptions = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };

  private constructor() {
    this.logger = Logger.getInstance();
  }

  public static getInstance(): Validator {
    if (!Validator.instance) {
      Validator.instance = new Validator();
    }
    return Validator.instance;
  }

  public validate(schema: ValidationSchema, options: ValidationOptions = {}) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const mergedOptions = { ...this.defaultOptions, ...options };

        // Validate request body
        if (schema.body) {
          const { error, value } = schema.body.validate(req.body, mergedOptions);
          if (error) {
            throw this.formatError(error);
          }
          req.body = value;
        }

        // Validate query parameters
        if (schema.query) {
          const { error, value } = schema.query.validate(req.query, mergedOptions);
          if (error) {
            throw this.formatError(error);
          }
          req.query = value;
        }

        // Validate URL parameters
        if (schema.params) {
          const { error, value } = schema.params.validate(req.params, mergedOptions);
          if (error) {
            throw this.formatError(error);
          }
          req.params = value;
        }

        // Validate headers
        if (schema.headers) {
          const { error, value } = schema.headers.validate(req.headers, mergedOptions);
          if (error) {
            throw this.formatError(error);
          }
          req.headers = value;
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  public async validateAsync<T>(
    data: T,
    schema: Joi.Schema,
    options: ValidationOptions = {}
  ): Promise<T> {
    try {
      const mergedOptions = { ...this.defaultOptions, ...options };
      const { error, value } = await schema.validateAsync(data, mergedOptions);
      if (error) {
        throw this.formatError(error);
      }
      return value;
    } catch (error) {
      this.logger.error('Validation error:', error);
      throw error;
    }
  }

  public async validatePartial<T>(
    data: Partial<T>,
    schema: Joi.Schema,
    options: ValidationOptions = {}
  ): Promise<Partial<T>> {
    try {
      const mergedOptions = { ...this.defaultOptions, ...options };
      const { error, value } = await schema.validateAsync(data, {
        ...mergedOptions,
        stripUnknown: true,
      });
      if (error) {
        throw this.formatError(error);
      }
      return value;
    } catch (error) {
      this.logger.error('Validation error:', error);
      throw error;
    }
  }

  public async validateArray<T>(
    data: T[],
    schema: Joi.Schema,
    options: ValidationOptions = {}
  ): Promise<T[]> {
    try {
      const mergedOptions = { ...this.defaultOptions, ...options };
      const arraySchema = Joi.array().items(schema);
      const { error, value } = await arraySchema.validateAsync(data, mergedOptions);
      if (error) {
        throw this.formatError(error);
      }
      return value;
    } catch (error) {
      this.logger.error('Validation error:', error);
      throw error;
    }
  }

  private formatError(error: Joi.ValidationError): ApiError {
    const details = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    this.logger.error('Validation error:', { details });
    return new ApiError(400, 'Validation error', details);
  }

  public createSchema<T>(schema: Joi.Schema<T>): Joi.Schema<T> {
    return schema;
  }

  public validatePartial<T>(
    schema: Joi.Schema<T>,
    data: Partial<T>,
    options: ValidationOptions = {}
  ): Partial<T> {
    try {
      const mergedOptions = { ...this.defaultOptions, ...options };
      const { error, value } = schema.validate(data, mergedOptions);
      
      if (error) {
        throw new ApiError(400, 'Validation Error', this.formatError(error));
      }

      return value;
    } catch (error) {
      this.logger.error('Validation error:', error);
      throw error;
    }
  }

  public validateArray<T>(
    schema: Joi.Schema<T>,
    data: unknown[],
    options: ValidationOptions = {}
  ): T[] {
    try {
      const mergedOptions = { ...this.defaultOptions, ...options };
      const { error, value } = schema.validate(data, mergedOptions);
      
      if (error) {
        throw new ApiError(400, 'Validation Error', this.formatError(error));
      }

      return value;
    } catch (error) {
      this.logger.error('Validation error:', error);
      throw error;
    }
  }

  public createObjectSchema<T>(schema: Record<string, Joi.Schema>): Joi.Schema {
    return Joi.object(schema);
  }

  public createArraySchema<T>(schema: Joi.Schema): Joi.Schema {
    return Joi.array().items(schema);
  }

  public createStringSchema(): Joi.Schema {
    return Joi.string();
  }

  public createNumberSchema(): Joi.Schema {
    return Joi.number();
  }

  public createBooleanSchema(): Joi.Schema {
    return Joi.boolean();
  }

  public createDateSchema(): Joi.Schema {
    return Joi.date();
  }

  public createEmailSchema(): Joi.Schema {
    return Joi.string().email();
  }

  public createPasswordSchema(): Joi.Schema {
    return Joi.string().min(8).max(100);
  }

  public createUrlSchema(): Joi.Schema {
    return Joi.string().uri();
  }

  public createUuidSchema(): Joi.Schema {
    return Joi.string().uuid();
  }

  public createEnumSchema<T extends string>(values: T[]): Joi.Schema {
    return Joi.string().valid(...values);
  }

  public createRegexSchema(pattern: RegExp): Joi.Schema {
    return Joi.string().regex(pattern);
  }

  public createCustomSchema<T>(
    validator: (value: any) => T | Promise<T>
  ): Joi.Schema {
    return Joi.custom(validator);
  }
} 