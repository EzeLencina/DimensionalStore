import type { IncomingMessage, ServerResponse } from 'http';
import type { Logger } from '../types';

export interface RequestLogOptions {
  logBody?: boolean;
  logHeaders?: boolean;
  maxBodyLength?: number;
}

export function requestLoggerMiddleware(
  logger: Logger,
  options: RequestLogOptions = {},
) {
  return (req: IncomingMessage, res: ServerResponse, next: () => void): void => {
    const start = Date.now();

    logger.info({
      message: 'Incoming request',
      method: req.method,
      url: req.url,
      ip: (req as any).ip ?? req.socket?.remoteAddress,
      requestId: (req as any).requestId,
      correlationId: (req as any).correlationId,
    });

    const originalEnd = res.end.bind(res);
    res.end = function (this: ServerResponse, ...args: any[]): any {
      const duration = Date.now() - start;

      logger.info({
        message: 'Request completed',
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration,
        requestId: (req as any).requestId,
        correlationId: (req as any).correlationId,
      });

      return originalEnd(...args);
    } as any;

    next();
  };
}
