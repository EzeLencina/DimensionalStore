import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { CatalogException } from '../../domain/exceptions';

@Catch(CatalogException)
export class CatalogExceptionFilter implements ExceptionFilter {
  catch(exception: CatalogException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode = this.getHttpStatus(exception.code);

    response.status(statusCode).json({
      statusCode,
      error: exception.code,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }

  private getHttpStatus(code: string): number {
    switch (true) {
      case code.includes('NOT_FOUND'):
        return 404;
      case code.includes('ALREADY_EXISTS'):
        return 409;
      case code.includes('VERSION_CONFLICT'):
        return 409;
      case code.includes('TENANT_MISMATCH'):
        return 403;
      case code.includes('INVALID'):
        return 400;
      case code.includes('ARCHIVED'):
        return 400;
      case code.includes('DELETED'):
        return 400;
      case code.includes('CIRCULAR'):
        return 400;
      default:
        return 500;
    }
  }
}
