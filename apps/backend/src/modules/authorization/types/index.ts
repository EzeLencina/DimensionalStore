import 'express';

declare global {
  namespace Express {
    interface Request {
      __authorization?: {
        permissions?: any[];
        scope?: { type: string; referenceId?: string };
        userId?: string;
        timestamp?: string;
        path?: string;
        method?: string;
      };
      context?: Record<string, unknown>;
    }
  }
}

export {};
