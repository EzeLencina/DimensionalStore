import { AppException } from './app.exception';

export class DatabaseException extends AppException {
  constructor(
    message = 'Database operation failed',
    errorCode = 'DB_001',
    details: Record<string, unknown> | null = null,
  ) {
    super(errorCode, message, 500, details);
    this.name = 'DatabaseException';
  }
}
