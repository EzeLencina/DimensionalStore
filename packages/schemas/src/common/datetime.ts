import { z } from 'zod';

export const dateSchema = z.string().datetime();

export const optionalDateSchema = z.string().datetime().optional();

export const futureDateSchema = z.string().datetime().refine(
  (val) => new Date(val) > new Date(),
  { message: 'Date must be in the future' },
);

export const pastDateSchema = z.string().datetime().refine(
  (val) => new Date(val) < new Date(),
  { message: 'Date must be in the past' },
);

export const dateRangeSchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
});
