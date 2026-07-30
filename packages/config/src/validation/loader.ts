import { envSchema, type Env } from './env.zod';

let cached: Env | null = null;

export interface ValidationResult {
  success: boolean;
  env: Env | null;
  errors: string[];
}

export function loadEnv(overrides?: Partial<Env>): Env {
  const source = { ...process.env, ...overrides } as Record<string, string | undefined>;

  const result = envSchema.safeParse(source);

  if (!result.success) {
    const errors = result.error.issues.map(
      (issue) => `[${issue.path.join('.')}] ${issue.message}`,
    );
    throw new Error(
      `Environment validation failed:\n${errors.map((e) => `  - ${e}`).join('\n')}`,
    );
  }

  cached = result.data;
  return cached;
}

export function loadEnvSafe(overrides?: Partial<Env>): ValidationResult {
  const source = { ...process.env, ...overrides } as Record<string, string | undefined>;

  const result = envSchema.safeParse(source);

  if (!result.success) {
    return {
      success: false,
      env: null,
      errors: result.error.issues.map(
        (issue) => `[${issue.path.join('.')}] ${issue.message}`,
      ),
    };
  }

  cached = result.data;
  return { success: true, env: cached, errors: [] };
}

export function getEnv(): Env {
  if (!cached) {
    return loadEnv();
  }
  return cached;
}

export function resetEnv(): void {
  cached = null;
}
