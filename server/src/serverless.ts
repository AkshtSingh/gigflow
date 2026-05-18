import serverless from 'serverless-http';
import { createApp } from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';

// Connect to DB at cold start; reuse connection across invocations
let dbConnected = false;
const ensureDb = async () => {
  if (dbConnected) return;
  try {
    await connectDatabase();
    dbConnected = true;
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Failed to initialize database for serverless function', err);
    throw err;
  }
};

const app = createApp();

// initialize DB immediately (will run at cold start)
ensureDb().catch((err) => {
  console.error('Database initialization failed:', err);
});

export const handler = serverless(app, {
  request: (req: any, event: any) => {
    // attach env info if needed
    req.__env = env;
    return req;
  }
});
