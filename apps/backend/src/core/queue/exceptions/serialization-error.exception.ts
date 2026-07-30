import { AppException } from '@common/exceptions/app.exception';
import { QUEUE_ERROR_CODES } from '../constants/queue-error-codes';

export class SerializationErrorException extends AppException {
  constructor(
    message = 'Failed to serialize or deserialize job data',
    details: Record<string, unknown> | null = null,
  ) {
    super(QUEUE_ERROR_CODES.SERIALIZATION_ERROR, message, 500, details);
    this.name = 'SerializationErrorException';
  }
}
