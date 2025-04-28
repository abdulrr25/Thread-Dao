import { ZodError } from 'zod';
import { AppError } from './errorHandler';
export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const errors = error.errors.map((err) => ({
                    path: err.path.join('.'),
                    message: err.message,
                }));
                next(new AppError(JSON.stringify(errors), 400));
            }
            else {
                next(error);
            }
        }
    };
};
