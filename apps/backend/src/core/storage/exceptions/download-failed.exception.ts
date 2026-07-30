import { AppException } from '@common/exceptions/app.exception';
import { STORAGE_ERROR_CODES } from '../constants/storage-error-codes';

export class DownloadFailedException extends AppException {
  constructor(
    message = 'File download failed',
    details: Record<string, unknown> | null = null,
  ) {
    super(STORAGE_ERROR_CODES.DOWNLOAD_FAILED, message, 500, details);
    this.name = 'DownloadFailedException';
  }
}
