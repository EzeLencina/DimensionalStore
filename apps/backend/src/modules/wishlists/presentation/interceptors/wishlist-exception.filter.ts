import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { WishlistException } from '../../domain';

@Catch(WishlistException)
export class WishlistExceptionFilter implements ExceptionFilter {
  catch(exception: WishlistException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.code === 'WISHLIST_NOT_FOUND' ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
    response.status(status).json({ statusCode: status, error: exception.code, message: exception.message, timestamp: new Date().toISOString() });
  }
}
