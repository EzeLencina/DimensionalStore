export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  timestamp: string;
  path: string;
  method: string;
  requestId?: string;
  correlationId?: string;
}

export function createSuccessResponse<T>(
  data: T,
  path: string,
  method: string,
  requestId?: string,
  correlationId?: string,
): SuccessResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
    path,
    method,
    requestId,
    correlationId,
  };
}
