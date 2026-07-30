import { AppException } from './app.exception';

export class DomainError extends AppException {
  constructor(
    code: string,
    message: string,
    httpStatus = 400,
    details: Record<string, unknown> | null = null,
  ) {
    super(code, message, httpStatus, details);
    this.name = 'DomainError';
  }
}
