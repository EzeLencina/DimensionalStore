import { AppException } from '@common/exceptions/app.exception';
import { STORAGE_ERROR_CODES } from '../constants/storage-error-codes';

export class ConfigurationErrorException extends AppException {
  constructor(
    message = 'Storage configuration error',
    details: Record<string, unknown> | null = null,
  ) {
    super(STORAGE_ERROR_CODES.CONFIGURATION_ERROR, message, 500, details);
    this.name = 'ConfigurationErrorException';
  }
}
