import { AppException } from '@common/exceptions/app.exception';
import { STORAGE_ERROR_CODES } from '../constants/storage-error-codes';

export class StorageTimeoutException extends AppException {
  constructor(
    message = 'Storage operation timed out',
    details: Record<string, unknown> | null = null,
  ) {
    super(STORAGE_ERROR_CODES.STORAGE_TIMEOUT, message, 500, details);
    this.name = 'StorageTimeoutException';
  }
}
