import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1)
  .max(254)
  .email('Invalid email address')
  .transform((v) => v.toLowerCase());

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters');

export const phoneSchema = z
  .string()
  .regex(
    /^\+?[1-9]\d{1,14}$/,
    'Invalid phone number (E.164 format required)',
  );

export const urlSchema = z.string().url('Invalid URL');

export const nameSchema = z.string().min(1).max(200);

export const descriptionSchema = z.string().max(2000).optional();
