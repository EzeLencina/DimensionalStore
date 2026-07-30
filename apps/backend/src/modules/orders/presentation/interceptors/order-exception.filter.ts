import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { OrderException } from '../../domain/exceptions';

@Catch(OrderException)
export class OrderExceptionFilter implements ExceptionFilter {
  catch(exception: OrderException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusMap: Record<string, HttpStatus> = {
      ORDER_NOT_FOUND: HttpStatus.NOT_FOUND,
      ORDER_NOTE_NOT_FOUND: HttpStatus.NOT_FOUND,
      ORDER_TENANT_MISMATCH: HttpStatus.FORBIDDEN,
      ORDER_CUSTOMER_MISMATCH: HttpStatus.FORBIDDEN,
      ORDER_VERSION_CONFLICT: HttpStatus.CONFLICT,
    };
    const status = statusMap[exception.code] ?? HttpStatus.BAD_REQUEST;
    response.status(status).json({
      statusCode: status,
      error: exception.code,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
