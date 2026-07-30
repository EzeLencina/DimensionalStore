import type { IncomingMessage } from 'http';

const SENSITIVE_HEADERS = [
  'authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'proxy-authorization',
];

export interface SerializedRequest {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  ip?: string;
  userAgent?: string;
  httpVersion?: string;
}

export function serializeRequest(req: IncomingMessage): SerializedRequest {
  const headers: Record<string, string> = {};

  if (req.headers) {
    for (const [key, value] of Object.entries(req.headers)) {
      if (SENSITIVE_HEADERS.includes(key.toLowerCase())) {
        headers[key] = '[REDACTED]';
      } else {
        headers[key] = Array.isArray(value) ? value.join(', ') : String(value ?? '');
      }
    }
  }

  return {
    method: req.method,
    url: req.url,
    headers,
    ip: (req as any).ip ?? req.socket?.remoteAddress,
    userAgent: req.headers?.['user-agent'],
    httpVersion: req.httpVersion,
  };
}
