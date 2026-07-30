import { AppException } from './app.exception';

export class ConflictException extends AppException {
  constructor(
    message = 'Resource already exists',
    errorCode = 'CONFLICT_001',
    details: Record<string, unknown> | null = null,
  ) {
    super(errorCode, message, 409, details);
    this.name = 'ConflictException';
  }
}
