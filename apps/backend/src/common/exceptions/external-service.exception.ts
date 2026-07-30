import { AppException } from './app.exception';

export class ExternalServiceException extends AppException {
  public readonly service: string;

  constructor(
    service: string,
    message = `External service error: ${service}`,
    errorCode = 'EXTERNAL_001',
    details: Record<string, unknown> | null = null,
  ) {
    super(errorCode, message, 502, details);
    this.name = 'ExternalServiceException';
    this.service = service;
  }
}
