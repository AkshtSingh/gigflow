import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import { z } from 'zod';

import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const authSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80).optional(),
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const createToken = (userId: string, role: string): string =>
  jwt.sign({ userId, role }, env.jwtSecret, { expiresIn: '7d' });

const sanitizeUser = (user: { _id: unknown; name: string; email: string; role?: string }) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role ?? 'sales'
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const payload = authSchema.parse(req.body);

  if (!payload.name) {
    throw new AppError('Name is required for registration', 400);
  }

  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError('Email already in use', 409);
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);
  const user = await User.create({
    name: payload.name,
    email: payload.email,
    password: hashedPassword
  });

  const token = createToken(String(user._id), user.role);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      token,
      user: sanitizeUser(user)
    }
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const payload = authSchema.omit({ name: true }).parse(req.body);

  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = createToken(String(user._id), user.role);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: sanitizeUser(user)
    }
  });
});