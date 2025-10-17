
import { Request, Response, NextFunction, RequestHandler } from 'express';

const schemas: { [key: string]: any } = {
  sendMessage: {
    message: {
      in: ['body'],
      isString: true,
      isLength: { options: { min: 1, max: 280 } },
      errorMessage: 'Message must be a string between 1 and 280 characters',
    },
  },
  // other schemas...
};

export const validateRequest = (schemaName: string): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const schema = schemas[schemaName];

    if (!schema) {
      return next();
    }

    // This is a simplified validation check. In a real app, you'd use a library like express-validator.
    for (const fieldName in schema) {
      const field = schema[fieldName];
      const value = req.body[fieldName];

      if (field.isString && typeof value !== 'string') {
        return res.status(400).json({ error: field.errorMessage });
      }

      if (field.isLength) {
        const { min, max } = field.isLength.options;
        if (value.length < min || value.length > max) {
          return res.status(400).json({ error: field.errorMessage });
        }
      }
    }

    next();
  };
};
