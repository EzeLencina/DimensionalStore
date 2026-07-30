import { AppException } from '@common/exceptions/app.exception';
import { STORAGE_ERROR_CODES } from '../constants/storage-error-codes';

export class DeleteFailedException extends AppException {
  constructor(
    message = 'File deletion failed',
    details: Record<string, unknown> | null = null,
  ) {
    super(STORAGE_ERROR_CODES.DELETE_FAILED, message, 500, details);
    this.name = 'DeleteFailedException';
  }
}
