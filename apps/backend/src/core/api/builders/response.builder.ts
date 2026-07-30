import { Injectable } from '@nestjs/common';
import type { ApiResponse, ApiPaginatedResponse, ApiErrorResponse, ResponseMeta } from '../types';
import type { IResponseBuilder } from '../interfaces';

@Injectable()
export class ResponseBuilder implements IResponseBuilder {
  success<T>(
    data: T,
    message = 'Operation successful',
    statusCode = 200,
    meta?: ResponseMeta,
  ): ApiResponse<T> {
    return {
      success: true,
      statusCode,
      message,
      data,
      meta,
      timestamp: new Date().toISOString(),
    };
  }

  created<T>(data: T, message = 'Resource created successfully'): ApiResponse<T> {
    return this.success(data, message, 201);
  }

  updated<T>(data: T, message = 'Resource updated successfully'): ApiResponse<T> {
    return this.success(data, message, 200);
  }

  deleted(message = 'Resource deleted successfully'): ApiResponse<null> {
    return this.success(null, message, 200);
  }

  paginated<T>(
    data: T[],
    paginationMeta: NonNullable<ResponseMeta['pagination']>,
    message = 'Resources retrieved successfully',
  ): ApiPaginatedResponse<T> {
    return {
      success: true,
      statusCode: 200,
      message,
      data,
      meta: { pagination: paginationMeta },
      timestamp: new Date().toISOString(),
    };
  }

  error(
    statusCode: number,
    message: string,
    code: string,
    details?: Record<string, unknown> | null,
    requestId?: string,
  ): ApiErrorResponse {
    return {
      success: false,
      statusCode,
      message,
      error: { code, details },
      timestamp: new Date().toISOString(),
      requestId,
    };
  }

  withMeta<T>(response: ApiResponse<T>, meta: Partial<ResponseMeta>): ApiResponse<T> {
    return {
      ...response,
      meta: { ...response.meta, ...meta },
    };
  }
}
