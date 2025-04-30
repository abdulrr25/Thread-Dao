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
        const validationErrors: Record<string, any> = {};

        // Validate request body
        if (schema.body) {
          const { error, value } = schema.body.validate(req.body, mergedOptions);
          if (error) {
            validationErrors.body = this.formatError(error);
          } else {
            req.body = value;
          }
        }

        // Validate query parameters
        if (schema.query) {
          const { error, value } = schema.query.validate(req.query, mergedOptions);
          if (error) {
            validationErrors.query = this.formatError(error);
          } else {
            req.query = value;
          }
        }

        // Validate URL parameters
        if (schema.params) {
          const { error, value } = schema.params.validate(req.params, mergedOptions);
          if (error) {
            validationErrors.params = this.formatError(error);
          } else {
            req.params = value;
          }
        }

        // Validate headers
        if (schema.headers) {
          const { error, value } = schema.headers.validate(req.headers, mergedOptions);
          if (error) {
            validationErrors.headers = this.formatError(error);
          } else {
            req.headers = value;
          }
        }

        // If there are validation errors, throw an error
        if (Object.keys(validationErrors).length > 0) {
          throw new ApiError(400, 'Validation Error', validationErrors);
        }

        next();
      } catch (error) {
        this.logger.error('Validation error:', error);
        next(error);
      }
    };
  }

  private formatError(error: Joi.ValidationError): Record<string, string[]> {
    const formattedErrors: Record<string, string[]> = {};

    error.details.forEach((detail) => {
      const key = detail.path.join('.');
      if (!formattedErrors[key]) {
        formattedErrors[key] = [];
      }
      formattedErrors[key].push(detail.message);
    });

    return formattedErrors;
  }

  public createSchema<T>(schema: Joi.Schema<T>): Joi.Schema<T> {
    return schema;
  }

  public async validateAsync<T>(
    schema: Joi.Schema<T>,
    data: unknown,
    options: ValidationOptions = {}
  ): Promise<T> {
    try {
      const mergedOptions = { ...this.defaultOptions, ...options };
      const { error, value } = await schema.validateAsync(data, mergedOptions);
      
      if (error) {
        throw new ApiError(400, 'Validation Error', this.formatError(error));
      }

      return value;
    } catch (error) {
      this.logger.error('Validation error:', error);
      throw error;
    }
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