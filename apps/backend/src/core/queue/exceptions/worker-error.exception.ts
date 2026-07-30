import { AppException } from '@common/exceptions/app.exception';
import { QUEUE_ERROR_CODES } from '../constants/queue-error-codes';

export class WorkerErrorException extends AppException {
  constructor(
    message = 'Worker encountered an error',
    details: Record<string, unknown> | null = null,
  ) {
    super(QUEUE_ERROR_CODES.WORKER_ERROR, message, 500, details);
    this.name = 'WorkerErrorException';
  }
}
