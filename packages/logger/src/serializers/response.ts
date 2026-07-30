import type { ServerResponse } from 'http';

export interface SerializedResponse {
  statusCode?: number;
  statusMessage?: string;
  headers?: Record<string, string>;
}

export function serializeResponse(res: ServerResponse): SerializedResponse {
  const headers: Record<string, string> = {};

  if (res.getHeaders) {
    const raw = res.getHeaders();
    for (const [key, value] of Object.entries(raw)) {
      headers[key] = Array.isArray(value) ? value.join(', ') : String(value ?? '');
    }
  }

  return {
    statusCode: res.statusCode,
    statusMessage: res.statusMessage,
    headers,
  };
}
