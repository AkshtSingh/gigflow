import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';

export const validate = (schema: { body?: ZodTypeAny; query?: ZodTypeAny; params?: ZodTypeAny }) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (schema.body) {
      schema.body.parse(req.body);
    }

    if (schema.query) {
      schema.query.parse(req.query);
    }

    if (schema.params) {
      schema.params.parse(req.params);
    }

    next();
  };
};