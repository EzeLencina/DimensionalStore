export interface ErrorResponse {
  success: false;
  statusCode: number;
  errorCode: string;
  message: string;
  timestamp: string;
  path: string;
  method: string;
  requestId?: string;
  correlationId?: string;
  details: Record<string, unknown> | null;
}

export function createErrorResponse(
  statusCode: number,
  errorCode: string,
  message: string,
  path: string,
  method: string,
  details: Record<string, unknown> | null = null,
  requestId?: string,
  correlationId?: string,
): ErrorResponse {
  return {
    success: false,
    statusCode,
    errorCode,
    message,
    timestamp: new Date().toISOString(),
    path,
    method,
    requestId,
    correlationId,
    details,
  };
}
