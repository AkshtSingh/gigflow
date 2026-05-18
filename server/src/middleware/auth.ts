import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    next(new AppError('Unauthorized', 401));
    return;
  }

  const token = header.slice(7);

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload & { role?: string };
    req.userId = decoded.userId;
    req.userRole = decoded.role ?? 'sales';
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
};