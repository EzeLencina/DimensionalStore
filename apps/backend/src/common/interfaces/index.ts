export interface AuthenticatedRequest {
  userId: string;
  tenantId?: string;
  roles?: string[];
}

export interface RequestContext {
  requestId: string;
  correlationId?: string;
  ip?: string;
  userAgent?: string;
}
