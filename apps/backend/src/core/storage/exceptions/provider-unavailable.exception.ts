import { AppException } from '@common/exceptions/app.exception';
import { STORAGE_ERROR_CODES } from '../constants/storage-error-codes';

export class ProviderUnavailableException extends AppException {
  constructor(
    message = 'Storage provider is unavailable',
    details: Record<string, unknown> | null = null,
  ) {
    super(STORAGE_ERROR_CODES.PROVIDER_UNAVAILABLE, message, 503, details);
    this.name = 'ProviderUnavailableException';
  }
}
