import cors from 'cors';
import express from 'express';

import { env } from './config/env.js';
import { authRouter } from './routes/authRoutes.js';
import { leadRouter } from './routes/leadRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export const createApp = (): express.Express => {
  const app = express();

  app.use(
    cors({
      origin: env.clientOrigin,
      credentials: true
    })
  );
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.status(200).json({ success: true, message: 'Smart Leads API is running' });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/leads', leadRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};