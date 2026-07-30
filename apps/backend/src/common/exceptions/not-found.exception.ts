import { AppException } from './app.exception';

export class NotFoundException extends AppException {
  constructor(
    resource = 'Resource',
    errorCode = 'NOT_FOUND_001',
    details: Record<string, unknown> | null = null,
  ) {
    super(errorCode, `${resource} not found`, 404, details);
    this.name = 'NotFoundException';
  }
}
