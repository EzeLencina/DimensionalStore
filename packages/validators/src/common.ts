import { z } from 'zod';
import { LIMITS } from '@tienda/constants';

export const uuidSchema = z.string().uuid();

export const idSchema = z.string().min(1).max(50);

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce
    .number()
    .int()
    .positive()
    .max(LIMITS.MAX_PAGE_SIZE)
    .default(LIMITS.DEFAULT_PAGE_SIZE),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const dateRangeSchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
});

export const booleanSchema = z.union([
  z.boolean(),
  z.enum(['true', 'false']).transform((v) => v === 'true'),
]);

export const statusSchema = z.enum(['ACTIVE', 'INACTIVE', 'DRAFT', 'ARCHIVED']);
