import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { SessionException } from '../domain/exceptions';

@Catch(SessionException)
export class SessionExceptionFilter implements ExceptionFilter {
  catch(exception: SessionException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusMap: Record<string, number> = {
      SESSION_NOT_FOUND: HttpStatus.NOT_FOUND,
      SESSION_EXPIRED: HttpStatus.UNAUTHORIZED,
      SESSION_REVOKED: HttpStatus.UNAUTHORIZED,
      SESSION_INACTIVE: HttpStatus.UNAUTHORIZED,
      SESSION_OWNER_MISMATCH: HttpStatus.FORBIDDEN,
      SESSION_LIMIT_EXCEEDED: HttpStatus.TOO_MANY_REQUESTS,
      DEVICE_NOT_FOUND: HttpStatus.NOT_FOUND,
      DEVICE_LIMIT_EXCEEDED: HttpStatus.TOO_MANY_REQUESTS,
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
