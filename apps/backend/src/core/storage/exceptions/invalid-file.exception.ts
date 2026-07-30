import { AppException } from '@common/exceptions/app.exception';
import { STORAGE_ERROR_CODES } from '../constants/storage-error-codes';

export class InvalidFileException extends AppException {
  constructor(
    message = 'Invalid file',
    details: Record<string, unknown> | null = null,
  ) {
    super(STORAGE_ERROR_CODES.INVALID_FILE, message, 400, details);
    this.name = 'InvalidFileException';
  }
}
