import { AppException } from '@common/exceptions/app.exception';
import { HTTP_ERROR_CODES } from '../constants/http-error-codes';

export class HttpTimeoutException extends AppException {
  constructor(
    message = 'HTTP request timed out',
    details: Record<string, unknown> | null = null,
  ) {
    super(HTTP_ERROR_CODES.TIMEOUT, message, 504, details);
    this.name = 'HttpTimeoutException';
  }
}

export class HttpConnectionFailedException extends AppException {
  constructor(
    message = 'Failed to connect to remote server',
    details: Record<string, unknown> | null = null,
  ) {
    super(HTTP_ERROR_CODES.CONNECTION_FAILED, message, 502, details);
    this.name = 'HttpConnectionFailedException';
  }
}

export class HttpDnsErrorException extends AppException {
  constructor(
    message = 'DNS resolution failed',
    details: Record<string, unknown> | null = null,
  ) {
    super(HTTP_ERROR_CODES.DNS_ERROR, message, 502, details);
    this.name = 'HttpDnsErrorException';
  }
}

export class HttpRetryExceededException extends AppException {
  constructor(
    message = 'Maximum retry attempts exceeded',
    details: Record<string, unknown> | null = null,
  ) {
    super(HTTP_ERROR_CODES.RETRY_EXCEEDED, message, 502, details);
    this.name = 'HttpRetryExceededException';
  }
}

export class HttpCircuitOpenException extends AppException {
  constructor(
    message = 'Circuit breaker is open',
    details: Record<string, unknown> | null = null,
  ) {
    super(HTTP_ERROR_CODES.CIRCUIT_OPEN, message, 503, details);
    this.name = 'HttpCircuitOpenException';
  }
}

export class HttpSerializationErrorException extends AppException {
  constructor(
    message = 'Failed to serialize request data',
    details: Record<string, unknown> | null = null,
  ) {
    super(HTTP_ERROR_CODES.SERIALIZATION_ERROR, message, 500, details);
    this.name = 'HttpSerializationErrorException';
  }
}

export class HttpDeserializationErrorException extends AppException {
  constructor(
    message = 'Failed to deserialize response data',
    details: Record<string, unknown> | null = null,
  ) {
    super(HTTP_ERROR_CODES.DESERIALIZATION_ERROR, message, 500, details);
    this.name = 'HttpDeserializationErrorException';
  }
}

export class HttpConfigurationException extends AppException {
  constructor(
    message = 'HTTP configuration error',
    details: Record<string, unknown> | null = null,
  ) {
    super(HTTP_ERROR_CODES.CONFIGURATION_ERROR, message, 500, details);
    this.name = 'HttpConfigurationException';
  }
}

export class HttpRequestFailedException extends AppException {
  constructor(
    message = 'HTTP request failed',
    details: Record<string, unknown> | null = null,
  ) {
    super(HTTP_ERROR_CODES.REQUEST_FAILED, message, 500, details);
    this.name = 'HttpRequestFailedException';
  }
}

export class HttpRateLimitedException extends AppException {
  constructor(
    message = 'HTTP rate limit exceeded',
    details: Record<string, unknown> | null = null,
  ) {
    super(HTTP_ERROR_CODES.RATE_LIMITED, message, 429, details);
    this.name = 'HttpRateLimitedException';
  }
}

export class HttpDriverUnavailableException extends AppException {
  constructor(
    message = 'HTTP driver is not available',
    details: Record<string, unknown> | null = null,
  ) {
    super(HTTP_ERROR_CODES.DRIVER_UNAVAILABLE, message, 501, details);
    this.name = 'HttpDriverUnavailableException';
  }
}

export class HttpInvalidUrlException extends AppException {
  constructor(
    message = 'Invalid URL provided',
    details: Record<string, unknown> | null = null,
  ) {
    super(HTTP_ERROR_CODES.INVALID_URL, message, 400, details);
    this.name = 'HttpInvalidUrlException';
  }
}
