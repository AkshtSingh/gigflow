import serverless from 'serverless-http';
import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

// Connect to DB at cold start; reuse connection across invocations
let dbConnected = false;
const ensureDb = async () => {
  if (dbConnected) return;
  await connectDatabase();
  dbConnected = true;
};

const app = createApp();

// initialize DB immediately (will run at cold start)
ensureDb().catch((err) => {
  console.error('Failed to initialize database for serverless function', err);
});

export const handler = serverless(app, {
  request: (req: any, event: any) => {
    // attach env info if needed
    req.__env = env;
    return req;
  }
});
