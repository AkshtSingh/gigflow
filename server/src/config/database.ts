import mongoose from 'mongoose';

import { env } from './env.js';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongoUri);
  } catch (error) {
    if (env.mongoFallbackUri) {
      console.warn('Primary MongoDB connection failed. Retrying with MONGODB_FALLBACK_URI...');
      await mongoose.connect(env.mongoFallbackUri);
      return;
    }

    throw error;
  }
};