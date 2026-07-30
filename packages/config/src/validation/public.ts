import { z } from 'zod';

export const publicEnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  NEXT_PUBLIC_API_URL: z.string().default('http://localhost:4000/api/v1'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('0.0.0'),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

export function loadPublicEnv(): PublicEnv {
  const source = process.env as Record<string, string | undefined>;
  const result = publicEnvSchema.safeParse(source);

  if (!result.success) {
    throw new Error(
      `Public environment validation failed:\n${result.error.issues
        .map((i) => `  - [${i.path.join('.')}] ${i.message}`)
        .join('\n')}`,
    );
  }

  return result.data;
}
