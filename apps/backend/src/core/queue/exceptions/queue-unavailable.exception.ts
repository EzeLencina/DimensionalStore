import { AppException } from '@common/exceptions/app.exception';
import { QUEUE_ERROR_CODES } from '../constants/queue-error-codes';

export class QueueUnavailableException extends AppException {
  constructor(
    message = 'Queue is currently unavailable',
    details: Record<string, unknown> | null = null,
  ) {
    super(QUEUE_ERROR_CODES.QUEUE_UNAVAILABLE, message, 503, details);
    this.name = 'QueueUnavailableException';
  }
}
