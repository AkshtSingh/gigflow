import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

const bootstrap = async (): Promise<void> => {
  await connectDatabase();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Smart Leads API listening on port ${env.port}`);
  });
};

bootstrap().catch((error) => {
  if (error?.name === 'MongooseServerSelectionError') {
    console.error('MongoDB connection failed. If you are using Atlas, verify Network Access IP whitelist and credentials.');
    console.error('For local development, set MONGODB_URI or MONGODB_FALLBACK_URI to mongodb://127.0.0.1:27017/smart-leads');
  }
  console.error('Failed to start server', error);
  process.exit(1);
});