import { getEnv } from '../validation';

export interface JwtConfig {
  readonly secret: string;
  readonly expiresIn: string;
  readonly refreshSecret: string;
  readonly refreshExpiresIn: string;
}

let cached: JwtConfig | null = null;

export function jwtConfig(): JwtConfig {
  if (cached) return cached;

  const env = getEnv();
  cached = {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshSecret: env.JWT_REFRESH_SECRET,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  };

  return cached;
}

export function resetJwtConfig(): void {
  cached = null;
}
