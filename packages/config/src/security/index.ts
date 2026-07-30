import { getEnv } from '../validation';

export interface SecurityConfig {
  readonly encryptionKey?: string;
  readonly bcryptRounds: number;
}

let cached: SecurityConfig | null = null;

export function securityConfig(): SecurityConfig {
  if (cached) return cached;

  const env = getEnv();
  cached = {
    encryptionKey: env.ENCRYPTION_KEY,
    bcryptRounds: env.BCRYPT_ROUNDS,
  };

  return cached;
}

export function resetSecurityConfig(): void {
  cached = null;
}
