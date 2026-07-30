import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { TenantException } from '../domain/exceptions';

@Catch(TenantException)
export class TenantExceptionFilter implements ExceptionFilter {
  catch(exception: TenantException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusMap: Record<string, number> = {
      TENANT_NOT_FOUND: HttpStatus.NOT_FOUND,
      TENANT_INACTIVE: HttpStatus.FORBIDDEN,
      TENANT_SUSPENDED: HttpStatus.FORBIDDEN,
      BRANCH_NOT_FOUND: HttpStatus.NOT_FOUND,
      BRANCH_INACTIVE: HttpStatus.FORBIDDEN,
      TENANT_MISMATCH: HttpStatus.FORBIDDEN,
      CONTEXT_NOT_FOUND: HttpStatus.NOT_FOUND,
      CROSS_TENANT_ACCESS_DENIED: HttpStatus.FORBIDDEN,
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
