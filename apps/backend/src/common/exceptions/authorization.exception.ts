import { AppException } from './app.exception';

export class AuthorizationException extends AppException {
  constructor(
    message = 'Insufficient permissions',
    errorCode = 'AUTH_002',
    details: Record<string, unknown> | null = null,
  ) {
    super(errorCode, message, 403, details);
    this.name = 'AuthorizationException';
  }
}
