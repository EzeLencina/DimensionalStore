import { AppException } from './app.exception';

export class InfrastructureException extends AppException {
  constructor(
    message = 'Internal server error',
    errorCode = 'INFRA_001',
    details: Record<string, unknown> | null = null,
  ) {
    super(errorCode, message, 500, details);
    this.name = 'InfrastructureException';
  }
}
