import { AppException } from './app.exception';

export class RateLimitException extends AppException {
  constructor(
    message = 'Too many requests',
    errorCode = 'RATE_LIMIT_001',
    details: Record<string, unknown> | null = null,
  ) {
    super(errorCode, message, 429, details);
    this.name = 'RateLimitException';
  }
}
