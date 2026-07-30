import { AppException } from './app.exception';

export class ConfigurationException extends AppException {
  constructor(
    message = 'Application configuration error',
    errorCode = 'CONFIG_001',
    details: Record<string, unknown> | null = null,
  ) {
    super(errorCode, message, 500, details);
    this.name = 'ConfigurationException';
  }
}
