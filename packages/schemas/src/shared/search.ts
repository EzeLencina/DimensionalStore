import { z } from 'zod';

export const searchSchema = z.object({
  q: z.string().max(200).optional(),
  searchFields: z.array(z.string()).optional(),
});

export type SearchInput = z.input<typeof searchSchema>;
export type SearchOutput = z.output<typeof searchSchema>;
