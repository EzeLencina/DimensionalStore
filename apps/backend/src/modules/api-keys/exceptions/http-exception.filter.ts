import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ApiKeyException } from '../domain/exceptions';

@Catch(ApiKeyException)
export class ApiKeyExceptionFilter implements ExceptionFilter {
  catch(exception: ApiKeyException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusMap: Record<string, number> = {
      API_KEY_NOT_FOUND: HttpStatus.NOT_FOUND,
      API_KEY_EXPIRED: HttpStatus.UNAUTHORIZED,
      API_KEY_REVOKED: HttpStatus.UNAUTHORIZED,
      API_KEY_INVALID: HttpStatus.UNAUTHORIZED,
      API_KEY_INVALID_FORMAT: HttpStatus.BAD_REQUEST,
      API_KEY_ALREADY_REVOKED: HttpStatus.CONFLICT,
      API_KEY_ROTATION_FAILED: HttpStatus.INTERNAL_SERVER_ERROR,
      API_KEY_LIMIT_EXCEEDED: HttpStatus.TOO_MANY_REQUESTS,
      API_KEY_HASH_FAILED: HttpStatus.INTERNAL_SERVER_ERROR,
      API_KEY_PREFIX_INVALID: HttpStatus.BAD_REQUEST,
      SERVICE_ACCOUNT_NOT_FOUND: HttpStatus.NOT_FOUND,
      SERVICE_ACCOUNT_DISABLED: HttpStatus.FORBIDDEN,
      SERVICE_ACCOUNT_SUSPENDED: HttpStatus.FORBIDDEN,
      SERVICE_ACCOUNT_LIMIT_EXCEEDED: HttpStatus.TOO_MANY_REQUESTS,
      SCOPE_INVALID: HttpStatus.BAD_REQUEST,
      SCOPE_NOT_ASSIGNED: HttpStatus.FORBIDDEN,
      TENANT_MISMATCH: HttpStatus.FORBIDDEN,
      BRANCH_MISMATCH: HttpStatus.FORBIDDEN,
      MACHINE_AUTH_FAILED: HttpStatus.UNAUTHORIZED,
      GRACE_PERIOD_EXPIRED: HttpStatus.GONE,
    };

    const status = statusMap[exception.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      success: false,
      statusCode: status,
      errorCode: exception.code,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
