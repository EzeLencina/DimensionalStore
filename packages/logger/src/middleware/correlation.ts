import { randomUUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'http';

const CORRELATION_HEADER = 'x-correlation-id';
const REQUEST_ID_HEADER = 'x-request-id';

export function getCorrelationId(req: IncomingMessage): string {
  return (
    (req.headers[CORRELATION_HEADER] as string) ??
    (req.headers[REQUEST_ID_HEADER] as string) ??
    randomUUID()
  );
}

export function getRequestId(): string {
  return randomUUID();
}

export function correlationMiddleware(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
): void {
  const correlationId = getCorrelationId(req);
  const requestId = getRequestId();

  (req as any).correlationId = correlationId;
  (req as any).requestId = requestId;

  res.setHeader(CORRELATION_HEADER, correlationId);
  res.setHeader(REQUEST_ID_HEADER, requestId);

  next();
}
