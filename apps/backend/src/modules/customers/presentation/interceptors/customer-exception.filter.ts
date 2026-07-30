import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CustomerException } from '../../domain';

@Catch(CustomerException)
export class CustomerExceptionFilter implements ExceptionFilter {
  catch(exception: CustomerException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.code === 'CUSTOMER_NOT_FOUND' ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
    response.status(status).json({ statusCode: status, error: exception.code, message: exception.message, timestamp: new Date().toISOString() });
  }
}
