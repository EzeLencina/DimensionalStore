import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AppException } from '@common/exceptions/app.exception';
import { createErrorResponse, type ErrorResponse } from '@common/responses/error-response';
import { ErrorCodes } from '@common/error-codes/codes';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const path = request.url ?? '/';
    const method = request.method ?? 'UNKNOWN';
    const requestId = request.requestId ?? request.id;
    const correlationId = request.correlationId;

    const errorResponse = this.normalizeError(exception, path, method, requestId, correlationId);

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private normalizeError(
    exception: unknown,
    path: string,
    method: string,
    requestId?: string,
    correlationId?: string,
  ): ErrorResponse {
    if (exception instanceof AppException) {
      return this.handleAppException(exception, path, method, requestId, correlationId);
    }

    if (exception instanceof HttpException) {
      return this.handleHttpException(exception, path, method, requestId, correlationId);
    }

    return this.handleUnknownError(exception, path, method, requestId, correlationId);
  }

  private handleAppException(
    exception: AppException,
    path: string,
    method: string,
    requestId?: string,
    correlationId?: string,
  ): ErrorResponse {
    return createErrorResponse(
      exception.httpStatus,
      exception.code,
      exception.message,
      path,
      method,
      exception.details,
      requestId,
      correlationId,
    );
  }

  private handleHttpException(
    exception: HttpException,
    path: string,
    method: string,
    requestId?: string,
    correlationId?: string,
  ): ErrorResponse {
    const status = exception.getStatus();
    const body = exception.getResponse();
    const message =
      typeof body === 'string'
        ? body
        : ((body as Record<string, unknown>)['message'] as string) ?? exception.message;

    const details =
      typeof body === 'object'
        ? ((body as Record<string, unknown>)['errors'] as Record<string, unknown>) ?? null
        : null;

    const code = this.resolveCodeFromStatus(status);

    return createErrorResponse(status, code, message, path, method, details, requestId, correlationId);
  }

  private handleUnknownError(
    exception: unknown,
    path: string,
    method: string,
    requestId?: string,
    correlationId?: string,
  ): ErrorResponse {
    const isProduction = process.env['NODE_ENV'] === 'production';

    return createErrorResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCodes.INFRA_001.code,
      isProduction ? ErrorCodes.INFRA_001.message : (exception as Error).message ?? 'Unknown error',
      path,
      method,
      null,
      requestId,
      correlationId,
    );
  }

  private resolveCodeFromStatus(status: number): string {
    const map: Record<number, string> = {
      400: ErrorCodes.VALIDATION_001.code,
      401: ErrorCodes.AUTH_001.code,
      403: ErrorCodes.AUTH_002.code,
      404: ErrorCodes.NOT_FOUND_001.code,
      409: ErrorCodes.CONFLICT_001.code,
      422: ErrorCodes.BUSINESS_001.code,
      429: ErrorCodes.RATE_LIMIT_001.code,
      500: ErrorCodes.INFRA_001.code,
      502: ErrorCodes.EXTERNAL_001.code,
      503: ErrorCodes.INFRA_002.code,
    };
    return map[status] ?? ErrorCodes.HTTP_ERROR.code;
  }
}
