import { AppException } from '@common/exceptions/app.exception';
import { API_ERROR_CODES } from '../constants/api-error-codes';

export class ApiVersionNotSupportedException extends AppException {
  constructor(
    message = 'API version not supported',
    details: Record<string, unknown> | null = null,
  ) {
    super(API_ERROR_CODES.VERSION_NOT_SUPPORTED, message, 400, details);
    this.name = 'ApiVersionNotSupportedException';
  }
}

export class ApiVersionNotFoundException extends AppException {
  constructor(
    message = 'API version not found',
    details: Record<string, unknown> | null = null,
  ) {
    super(API_ERROR_CODES.VERSION_NOT_FOUND, message, 404, details);
    this.name = 'ApiVersionNotFoundException';
  }
}

export class ApiInvalidPaginationException extends AppException {
  constructor(
    message = 'Invalid pagination parameters',
    details: Record<string, unknown> | null = null,
  ) {
    super(API_ERROR_CODES.INVALID_PAGINATION, message, 400, details);
    this.name = 'ApiInvalidPaginationException';
  }
}

export class ApiInvalidSortingException extends AppException {
  constructor(
    message = 'Invalid sorting parameters',
    details: Record<string, unknown> | null = null,
  ) {
    super(API_ERROR_CODES.INVALID_SORTING, message, 400, details);
    this.name = 'ApiInvalidSortingException';
  }
}

export class ApiInvalidFilterException extends AppException {
  constructor(
    message = 'Invalid filter parameters',
    details: Record<string, unknown> | null = null,
  ) {
    super(API_ERROR_CODES.INVALID_FILTER, message, 400, details);
    this.name = 'ApiInvalidFilterException';
  }
}

export class ApiInvalidSearchException extends AppException {
  constructor(
    message = 'Invalid search parameters',
    details: Record<string, unknown> | null = null,
  ) {
    super(API_ERROR_CODES.INVALID_SEARCH, message, 400, details);
    this.name = 'ApiInvalidSearchException';
  }
}

export class ApiInvalidFieldSelectionException extends AppException {
  constructor(
    message = 'Invalid field selection parameters',
    details: Record<string, unknown> | null = null,
  ) {
    super(API_ERROR_CODES.INVALID_FIELD_SELECTION, message, 400, details);
    this.name = 'ApiInvalidFieldSelectionException';
  }
}

export class ApiInvalidResponseFormatException extends AppException {
  constructor(
    message = 'Invalid response format',
    details: Record<string, unknown> | null = null,
  ) {
    super(API_ERROR_CODES.INVALID_RESPONSE_FORMAT, message, 400, details);
    this.name = 'ApiInvalidResponseFormatException';
  }
}

export class ApiOpenApiConfigException extends AppException {
  constructor(
    message = 'OpenAPI configuration error',
    details: Record<string, unknown> | null = null,
  ) {
    super(API_ERROR_CODES.OPENAPI_CONFIG_ERROR, message, 500, details);
    this.name = 'ApiOpenApiConfigException';
  }
}

export class ApiVersioningConfigException extends AppException {
  constructor(
    message = 'Versioning configuration error',
    details: Record<string, unknown> | null = null,
  ) {
    super(API_ERROR_CODES.VERSIONING_CONFIG_ERROR, message, 500, details);
    this.name = 'ApiVersioningConfigException';
  }
}
