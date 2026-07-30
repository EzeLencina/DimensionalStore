import { AppException } from '@common/exceptions/app.exception';
import { STORAGE_ERROR_CODES } from '../constants/storage-error-codes';

export class UploadFailedException extends AppException {
  constructor(
    message = 'File upload failed',
    details: Record<string, unknown> | null = null,
  ) {
    super(STORAGE_ERROR_CODES.UPLOAD_FAILED, message, 500, details);
    this.name = 'UploadFailedException';
  }
}
