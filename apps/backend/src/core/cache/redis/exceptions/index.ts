import { AppException } from '@common/exceptions/app.exception';

export class RedisException extends AppException {
  constructor(
    message = 'Redis operation failed',
    errorCode = 'REDIS_001',
    details: Record<string, unknown> | null = null,
  ) {
    super(errorCode, message, 500, details);
    this.name = 'RedisException';
  }
}

export class RedisConnectionException extends RedisException {
  constructor(
    message = 'Failed to connect to Redis',
    details: Record<string, unknown> | null = null,
  ) {
    super(message, 'REDIS_001', details);
    this.name = 'RedisConnectionException';
  }
}

export class RedisTimeoutException extends RedisException {
  constructor(
    message = 'Redis command timed out',
    details: Record<string, unknown> | null = null,
  ) {
    super(message, 'REDIS_002', details);
    this.name = 'RedisTimeoutException';
  }
}

export class RedisSerializationException extends RedisException {
  constructor(
    message = 'Failed to serialize/deserialize Redis value',
    details: Record<string, unknown> | null = null,
  ) {
    super(message, 'REDIS_003', details);
    this.name = 'RedisSerializationException';
  }
}

export class RedisUnavailableException extends RedisException {
  constructor(
    message = 'Redis is currently unavailable',
    details: Record<string, unknown> | null = null,
  ) {
    super(message, 'REDIS_004', details);
    this.name = 'RedisUnavailableException';
  }
}

export class RedisConfigurationException extends RedisException {
  constructor(
    message = 'Redis configuration error',
    details: Record<string, unknown> | null = null,
  ) {
    super(message, 'REDIS_005', details);
    this.name = 'RedisConfigurationException';
  }
}

export class RedisCommandException extends RedisException {
  constructor(
    message = 'Redis command failed',
    details: Record<string, unknown> | null = null,
  ) {
    super(message, 'REDIS_006', details);
    this.name = 'RedisCommandException';
  }
}
