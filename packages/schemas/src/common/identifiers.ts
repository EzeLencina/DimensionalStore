import { z } from 'zod';

export const uuidSchema = z.string().uuid();

export const idSchema = z.string().min(1).max(50);

export const slugSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format');
