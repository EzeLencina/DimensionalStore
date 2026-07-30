import { AppException } from './app.exception';

export class ValidationException extends AppException {
  constructor(
    message = 'Validation failed',
    errorCode = 'VALIDATION_001',
    details: Record<string, unknown> | null = null,
  ) {
    super(errorCode, message, 400, details);
    this.name = 'ValidationException';
  }
}
