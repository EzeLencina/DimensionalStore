import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ReviewException, REVIEW_ERROR_CODES } from '../../domain';

@Catch(ReviewException)
export class ReviewExceptionFilter implements ExceptionFilter {
  catch(exception: ReviewException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const status = [REVIEW_ERROR_CODES.REVIEW_NOT_FOUND, REVIEW_ERROR_CODES.REVIEW_PRODUCT_NOT_FOUND, REVIEW_ERROR_CODES.REVIEW_RESPONSE_NOT_FOUND].includes(exception.code as never) ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
    response.status(status).json({ statusCode: status, error: exception.code, message: exception.message, timestamp: new Date().toISOString() });
  }
}
