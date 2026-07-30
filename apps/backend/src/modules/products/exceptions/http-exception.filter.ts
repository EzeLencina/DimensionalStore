import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ProductException } from '../domain/exceptions';

const STATUS_MAP: Record<string, number> = {
  PRODUCT_NOT_FOUND: HttpStatus.NOT_FOUND,
  PRODUCT_SLUG_ALREADY_EXISTS: HttpStatus.CONFLICT,
  PRODUCT_INVALID_STATUS_TRANSITION: HttpStatus.UNPROCESSABLE_ENTITY,
  PRODUCT_ARCHIVED: HttpStatus.CONFLICT,
  PRODUCT_DELETED: HttpStatus.CONFLICT,
  PRODUCT_INVALID_DATA: HttpStatus.BAD_REQUEST,
  PRODUCT_TENANT_MISMATCH: HttpStatus.FORBIDDEN,
  PRODUCT_VERSION_CONFLICT: HttpStatus.CONFLICT,
  PRODUCT_INVALID_NAME: HttpStatus.BAD_REQUEST,
  PRODUCT_INVALID_SLUG: HttpStatus.BAD_REQUEST,
  PRODUCT_INVALID_VISIBILITY: HttpStatus.BAD_REQUEST,
  PRODUCT_INVALID_WARRANTY: HttpStatus.BAD_REQUEST,
  PRODUCT_INVALID_SEO: HttpStatus.BAD_REQUEST,
};

@Catch(ProductException)
export class ProductExceptionFilter implements ExceptionFilter {
  catch(exception: ProductException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = STATUS_MAP[exception.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      success: false,
      statusCode: status,
      errorCode: exception.code,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
