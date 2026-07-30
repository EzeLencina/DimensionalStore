import { AppException } from './app.exception';

export class BusinessException extends AppException {
  constructor(
    message: string,
    errorCode = 'BUSINESS_001',
    details: Record<string, unknown> | null = null,
  ) {
    super(errorCode, message, 422, details);
    this.name = 'BusinessException';
  }
}
