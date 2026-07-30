import { AppException } from './app.exception';

export class CacheException extends AppException {
  constructor(
    message = 'Cache operation failed',
    errorCode = 'CACHE_001',
    details: Record<string, unknown> | null = null,
  ) {
    super(errorCode, message, 500, details);
    this.name = 'CacheException';
  }
}
