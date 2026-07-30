import { Session } from '../entities/session.entity';
import { SessionException, SESSION_ERROR_CODES } from '../exceptions';

export class SessionValidator {
  validateSession(session: Session | null): Session {
    if (!session) {
      throw new SessionException(SESSION_ERROR_CODES.SESSION_NOT_FOUND, 'Session not found');
    }

    if (session.isRevoked()) {
      throw new SessionException(
        SESSION_ERROR_CODES.SESSION_REVOKED,
        `Session has been revoked${session.getRevocationReason() ? `: ${session.getRevocationReason()}` : ''}`,
      );
    }

    if (session.isExpired()) {
      throw new SessionException(SESSION_ERROR_CODES.SESSION_EXPIRED, 'Session has expired');
    }

    if (!session.isActive()) {
      throw new SessionException(SESSION_ERROR_CODES.SESSION_INACTIVE, 'Session is not active');
    }

    return session;
  }

  validateOwnership(session: Session, userId: string): void {
    if (session.getUserId() !== userId) {
      throw new SessionException(
        SESSION_ERROR_CODES.SESSION_OWNER_MISMATCH,
        'Session does not belong to this user',
      );
    }
  }

  validateConcurrentSessions(currentCount: number, maxSessions: number): void {
    if (currentCount >= maxSessions) {
      throw new SessionException(
        SESSION_ERROR_CODES.SESSION_LIMIT_EXCEEDED,
        `Maximum concurrent sessions reached (${maxSessions})`,
      );
    }
  }

  validateSessionId(sessionId: string): boolean {
    return sessionId.length > 0 && sessionId.length <= 128;
  }

  validateDeviceId(deviceId: string): boolean {
    return deviceId.length > 0 && deviceId.length <= 128;
  }
}
