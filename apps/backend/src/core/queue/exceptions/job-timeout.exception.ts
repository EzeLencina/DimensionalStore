import { AppException } from '@common/exceptions/app.exception';
import { QUEUE_ERROR_CODES } from '../constants/queue-error-codes';

export class JobTimeoutException extends AppException {
  constructor(
    message = 'Job execution timed out',
    details: Record<string, unknown> | null = null,
  ) {
    super(QUEUE_ERROR_CODES.JOB_TIMEOUT, message, 500, details);
    this.name = 'JobTimeoutException';
  }
}
