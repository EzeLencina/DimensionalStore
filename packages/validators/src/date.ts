import { z } from 'zod';

export const dateSchema = z.string().datetime();

export const optionalDateSchema = z.string().datetime().optional();

export const futureDateSchema = z.string().datetime().refine(
  (val) => new Date(val) > new Date(),
  { message: 'La fecha debe ser futura' },
);

export const pastDateSchema = z.string().datetime().refine(
  (val) => new Date(val) < new Date(),
  { message: 'La fecha debe ser pasada' },
);
