import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';

@Injectable()
export class AuthenticationEventHandler {
  constructor(
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  handleUserLoggedIn(event: { userId: string; email: string; sessionId: string }): void {
    this.logger.info(
      { event: 'auth.event.user_logged_in', userId: event.userId, sessionId: event.sessionId },
      'User login event',
    );
  }

  handleUserLoggedOut(event: { userId: string; sessionId: string }): void {
    this.logger.info(
      { event: 'auth.event.user_logged_out', userId: event.userId, sessionId: event.sessionId },
      'User logout event',
    );
  }

  handleTokenGenerated(event: { userId: string; tokenId: string; tokenType: string }): void {
    this.logger.info(
      { event: 'auth.event.token_generated', userId: event.userId, tokenType: event.tokenType },
      'Token generated event',
    );
  }

  handleTokenRevoked(event: { userId: string; tokenId: string; tokenType: string }): void {
    this.logger.info(
      { event: 'auth.event.token_revoked', userId: event.userId, tokenType: event.tokenType },
      'Token revoked event',
    );
  }

  handlePasswordVerified(event: { userId: string; success: boolean }): void {
    this.logger.info(
      { event: 'auth.event.password_verified', userId: event.userId, success: event.success },
      'Password verification event',
    );
  }

  handleAuthenticationFailed(event: { email: string; reason: string }): void {
    this.logger.warn(
      { event: 'auth.event.authentication_failed', email: event.email, reason: event.reason },
      'Authentication failed event',
    );
  }
}
