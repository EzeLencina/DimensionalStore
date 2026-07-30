export const LOG_LEVELS = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'] as const;

export const DEFAULT_LOGGER_CONFIG = {
  level: 'info' as const,
  prettyPrint: true,
  enabled: true,
};

export const SENSITIVE_KEYS = [
  'password',
  'passwd',
  'secret',
  'token',
  'apiKey',
  'api_key',
  'api-key',
  'authorization',
  'Authorization',
  'cookie',
  'Cookie',
  'set-cookie',
  'Set-Cookie',
  'jwt',
  'refreshToken',
  'refresh_token',
  'accessToken',
  'access_token',
  'creditCard',
  'credit_card',
  'ccNumber',
  'ccv',
  'cvv',
  'ssn',
  'email',
  'phone',
  'phoneNumber',
  'privateKey',
  'private_key',
  'stripeKey',
  'stripe_secret',
] as const;

export const PINO_LEVELS: Record<string, number> = {
  fatal: 60,
  error: 50,
  warn: 40,
  info: 30,
  debug: 20,
  trace: 10,
};
