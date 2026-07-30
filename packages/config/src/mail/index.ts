import { getEnv } from '../validation';

export interface MailConfig {
  readonly host: string;
  readonly port: number;
  readonly user?: string;
  readonly pass?: string;
}

let cached: MailConfig | null = null;

export function mailConfig(): MailConfig {
  if (cached) return cached;

  const env = getEnv();
  cached = {
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  };

  return cached;
}

export function resetMailConfig(): void {
  cached = null;
}
