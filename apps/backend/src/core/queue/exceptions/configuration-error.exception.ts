import { AppException } from '@common/exceptions/app.exception';
import { QUEUE_ERROR_CODES } from '../constants/queue-error-codes';

export class ConfigurationErrorException extends AppException {
  constructor(
    message = 'Queue configuration error',
    details: Record<string, unknown> | null = null,
  ) {
    super(QUEUE_ERROR_CODES.CONFIGURATION_ERROR, message, 500, details);
    this.name = 'ConfigurationErrorException';
  }
}
