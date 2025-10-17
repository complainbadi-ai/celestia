
import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement authentication logic
  next();
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement admin authentication logic
  next();
};
