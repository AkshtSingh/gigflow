import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
};

export const env = {
  port: Number(process.env.PORT ?? 4000),
  mongoUri: requiredEnv(process.env.MONGODB_URI, 'MONGODB_URI'),
  mongoFallbackUri: process.env.MONGODB_FALLBACK_URI,
  jwtSecret: requiredEnv(process.env.JWT_SECRET, 'JWT_SECRET'),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173'
};