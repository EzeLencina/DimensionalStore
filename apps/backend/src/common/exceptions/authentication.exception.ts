import { AppException } from './app.exception';

export class AuthenticationException extends AppException {
  constructor(
    message = 'Authentication required',
    errorCode = 'AUTH_001',
    details: Record<string, unknown> | null = null,
  ) {
    super(errorCode, message, 401, details);
    this.name = 'AuthenticationException';
  }
}
