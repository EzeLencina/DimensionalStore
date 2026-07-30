import { z } from 'zod';

export const positiveNumberSchema = z.number().positive();

export const nonNegativeNumberSchema = z.number().min(0);

export const priceSchema = z.number().min(0).max(999999999.99);

export const percentageSchema = z.number().min(0).max(100);

export const integerSchema = z.number().int();

export const quantitySchema = z.number().int().min(0);
