import { AppException } from '@common/exceptions/app.exception';
import { MAIL_ERROR_CODES } from '../constants/mail-error-codes';

export class MailSendException extends AppException {
  constructor(
    message = 'Failed to send email',
    details: Record<string, unknown> | null = null,
  ) {
    super(MAIL_ERROR_CODES.SEND_FAILED, message, 500, details);
    this.name = 'MailSendException';
  }
}

export class MailConnectionException extends AppException {
  constructor(
    message = 'Failed to connect to mail provider',
    details: Record<string, unknown> | null = null,
  ) {
    super(MAIL_ERROR_CODES.CONNECTION_FAILED, message, 503, details);
    this.name = 'MailConnectionException';
  }
}

export class MailAuthenticationException extends AppException {
  constructor(
    message = 'Mail provider authentication failed',
    details: Record<string, unknown> | null = null,
  ) {
    super(MAIL_ERROR_CODES.AUTHENTICATION_FAILED, message, 502, details);
    this.name = 'MailAuthenticationException';
  }
}

export class MailProviderUnavailableException extends AppException {
  constructor(
    message = 'Mail provider is unavailable',
    details: Record<string, unknown> | null = null,
  ) {
    super(MAIL_ERROR_CODES.PROVIDER_UNAVAILABLE, message, 503, details);
    this.name = 'MailProviderUnavailableException';
  }
}

export class MailTimeoutException extends AppException {
  constructor(
    message = 'Mail operation timed out',
    details: Record<string, unknown> | null = null,
  ) {
    super(MAIL_ERROR_CODES.TIMEOUT, message, 500, details);
    this.name = 'MailTimeoutException';
  }
}

export class MailInvalidAddressException extends AppException {
  constructor(
    message = 'Invalid email address',
    details: Record<string, unknown> | null = null,
  ) {
    super(MAIL_ERROR_CODES.INVALID_ADDRESS, message, 400, details);
    this.name = 'MailInvalidAddressException';
  }
}

export class MailTemplateException extends AppException {
  constructor(
    message = 'Email template error',
    details: Record<string, unknown> | null = null,
  ) {
    super(MAIL_ERROR_CODES.TEMPLATE_ERROR, message, 500, details);
    this.name = 'MailTemplateException';
  }
}

export class MailRendererException extends AppException {
  constructor(
    message = 'Email renderer error',
    details: Record<string, unknown> | null = null,
  ) {
    super(MAIL_ERROR_CODES.RENDER_ERROR, message, 500, details);
    this.name = 'MailRendererException';
  }
}

export class MailConfigurationException extends AppException {
  constructor(
    message = 'Mail configuration error',
    details: Record<string, unknown> | null = null,
  ) {
    super(MAIL_ERROR_CODES.CONFIGURATION_ERROR, message, 500, details);
    this.name = 'MailConfigurationException';
  }
}

export class MailRateLimitException extends AppException {
  constructor(
    message = 'Mail rate limit exceeded',
    details: Record<string, unknown> | null = null,
  ) {
    super(MAIL_ERROR_CODES.RATE_LIMIT_EXCEEDED, message, 429, details);
    this.name = 'MailRateLimitException';
  }
}
