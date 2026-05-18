import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError.js';

export const requireRole = (roles: Array<'admin' | 'sales'>) => (req: Request, _res: Response, next: NextFunction) => {
  const role = (req as Request & { userRole?: string }).userRole ?? 'sales';

  if (!roles.includes(role as 'admin' | 'sales')) {
    next(new AppError('Forbidden', 403));
    return;
  }

  next();
};
