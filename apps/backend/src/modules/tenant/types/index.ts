import 'express';
import { TenantContext } from '../domain/types';

declare global {
  namespace Express {
    interface Request {
      tenantContext?: TenantContext;
      tenantId?: string;
      branchId?: string;
      locale?: string;
      timezone?: string;
      currency?: string;
      __tenant?: {
        tenantId: string;
        tenantSlug: string;
        branchId?: string;
        locale: string;
        timezone: string;
        currency: string;
      };
    }
  }
}

export {};
