import 'express';
import { Session } from '../domain/entities/session.entity';

declare global {
  namespace Express {
    interface Request {
      session?: Session;
      __session?: {
        sessionId?: string;
        userId?: string;
        deviceId?: string;
        ipAddress?: string;
        userAgent?: string;
        timezone?: string;
        locale?: string;
        createdAt?: Date;
        lastActivity?: Date;
        expiresAt?: Date;
        timestamp?: string;
      };
    }
  }
}

export {};
