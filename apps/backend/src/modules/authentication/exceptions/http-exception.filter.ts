import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationException } from '../domain/exceptions';

@Catch(AuthenticationException)
export class AuthenticationExceptionFilter implements ExceptionFilter {
  catch(exception: AuthenticationException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusMap: Record<string, number> = {
      AUTH_INVALID_CREDENTIALS: HttpStatus.UNAUTHORIZED,
      AUTH_TOKEN_EXPIRED: HttpStatus.UNAUTHORIZED,
      AUTH_TOKEN_INVALID: HttpStatus.UNAUTHORIZED,
      AUTH_TOKEN_REVOKED: HttpStatus.UNAUTHORIZED,
      AUTH_SESSION_EXPIRED: HttpStatus.UNAUTHORIZED,
      AUTH_SESSION_INVALID: HttpStatus.UNAUTHORIZED,
      AUTH_USER_INACTIVE: HttpStatus.FORBIDDEN,
      AUTH_USER_SUSPENDED: HttpStatus.FORBIDDEN,
      AUTH_USER_DELETED: HttpStatus.GONE,
      AUTH_EMAIL_NOT_VERIFIED: HttpStatus.FORBIDDEN,
      AUTH_REFRESH_TOKEN_INVALID: HttpStatus.UNAUTHORIZED,
      AUTH_REFRESH_TOKEN_EXPIRED: HttpStatus.UNAUTHORIZED,
      AUTH_PASSWORD_POLICY_VIOLATION: HttpStatus.UNPROCESSABLE_ENTITY,
      AUTH_RATE_LIMIT_EXCEEDED: HttpStatus.TOO_MANY_REQUESTS,
      AUTH_INVALID_TOKEN_TYPE: HttpStatus.UNAUTHORIZED,
      AUTH_MISSING_TOKEN: HttpStatus.UNAUTHORIZED,
      AUTH_CLOCK_DRIFT_DETECTED: HttpStatus.UNAUTHORIZED,
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
