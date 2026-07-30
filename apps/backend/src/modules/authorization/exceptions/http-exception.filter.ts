import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthorizationException } from '../domain/exceptions';

@Catch(AuthorizationException)
export class AuthorizationExceptionFilter implements ExceptionFilter {
  catch(exception: AuthorizationException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusMap: Record<string, number> = {
      AUTHZ_PERMISSION_DENIED: HttpStatus.FORBIDDEN,
      AUTHZ_ROLE_NOT_FOUND: HttpStatus.NOT_FOUND,
      AUTHZ_PERMISSION_NOT_FOUND: HttpStatus.NOT_FOUND,
      AUTHZ_POLICY_NOT_FOUND: HttpStatus.NOT_FOUND,
      AUTHZ_INVALID_PERMISSION_FORMAT: HttpStatus.UNPROCESSABLE_ENTITY,
      AUTHZ_INVALID_ROLE_NAME: HttpStatus.UNPROCESSABLE_ENTITY,
      AUTHZ_INVALID_POLICY_NAME: HttpStatus.UNPROCESSABLE_ENTITY,
      AUTHZ_CIRCULAR_ROLE_HIERARCHY: HttpStatus.UNPROCESSABLE_ENTITY,
      AUTHZ_DUPLICATE_PERMISSION: HttpStatus.CONFLICT,
      AUTHZ_CANNOT_MODIFY_SYSTEM_ROLE: HttpStatus.FORBIDDEN,
      AUTHZ_MAX_ROLE_DEPTH_EXCEEDED: HttpStatus.UNPROCESSABLE_ENTITY,
      AUTHZ_ROLE_ALREADY_ASSIGNED: HttpStatus.CONFLICT,
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
