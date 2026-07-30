import { z } from 'zod';

export const sortingSchema = z.object({
  sortBy: z.string().min(1).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export type SortingInput = z.input<typeof sortingSchema>;
export type SortingOutput = z.output<typeof sortingSchema>;
