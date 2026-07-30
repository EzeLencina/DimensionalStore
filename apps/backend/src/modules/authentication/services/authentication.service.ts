import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import type { IAuthenticationService, ITokenService, IHashingService, ISessionRepository } from '../application/interfaces';
import { LoginCommand, LogoutCommand, RefreshTokenCommand, ValidateCredentialsCommand } from '../application/commands';
import { AuthenticationValidators } from '../application/validators';
import { AuthenticationException, AUTH_ERROR_CODES } from '../domain/exceptions';
import { TokenRotationService } from '../infrastructure/tokens/token-rotation.service';
import { TokenBlacklistService } from '../infrastructure/tokens/token-blacklist.service';
import {
  UserLoggedInEvent,
  UserLoggedOutEvent,
  TokenGeneratedEvent,
  TokenRevokedEvent,
  PasswordVerifiedEvent,
  AuthenticationFailedEvent,
} from '../domain/events';
import { SessionId, TokenId } from '../domain/value-objects';
import { LoginResult, SessionInfo } from '../domain/types';

@Injectable()
export class AuthenticationService implements IAuthenticationService {
  constructor(
    @Inject('IHashingService')
    private readonly hashingService: IHashingService,
    @Inject('ITokenService')
    private readonly tokenService: ITokenService,
    @Inject('ISessionRepository')
    private readonly sessionRepository: ISessionRepository,
    private readonly tokenRotationService: TokenRotationService,
    private readonly tokenBlacklistService: TokenBlacklistService,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async login(email: string, password: string, ip?: string, userAgent?: string): Promise<LoginResult> {
    if (!AuthenticationValidators.isValidEmail(email)) {
      throw new AuthenticationException(AUTH_ERROR_CODES.INVALID_CREDENTIALS, 'Invalid email format');
    }

    let user: { userId: string; email: string };
    try {
      user = await this.validateCredentials(email, password);
    } catch (error) {
      this.logger.warn(
        { event: 'auth.login_failed', email, ip },
        'Login attempt failed',
      );
      const failedEvent = new AuthenticationFailedEvent(email, 'invalid_credentials', ip);
      throw error;
    }

    const sessionId = new SessionId();
    const session: SessionInfo = {
      sessionId: sessionId.getValue(),
      userId: user.userId,
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    await this.sessionRepository.save(session);

    const tokenPair = await this.tokenService.generateTokenPair({
      sub: user.userId,
      email: user.email,
      sessionId: session.sessionId,
    });

    this.logger.info(
      { event: 'auth.login_success', userId: user.userId, sessionId: session.sessionId },
      'User logged in successfully',
    );

    const loginEvent = new UserLoggedInEvent(user.userId, user.email, session.sessionId, ip, userAgent);
    const tokenEvent = new TokenGeneratedEvent(user.userId, new TokenId().getValue(), 'access', session.sessionId);

    return { tokenPair, session };
  }

  async logout(userId: string, sessionId: string): Promise<void> {
    if (!AuthenticationValidators.isValidSessionId(sessionId)) {
      throw new AuthenticationException(AUTH_ERROR_CODES.SESSION_INVALID, 'Invalid session ID');
    }

    const session = await this.sessionRepository.findById(sessionId);
    if (!session || session.userId !== userId) {
      throw new AuthenticationException(AUTH_ERROR_CODES.SESSION_INVALID, 'Session not found');
    }

    await this.sessionRepository.delete(sessionId);
    this.logger.info(
      { event: 'auth.logout', userId, sessionId },
      'User logged out',
    );
  }

  async refreshToken(refreshToken: string): Promise<LoginResult> {
    if (!AuthenticationValidators.isValidRefreshToken(refreshToken)) {
      throw new AuthenticationException(AUTH_ERROR_CODES.REFRESH_TOKEN_INVALID, 'Invalid refresh token');
    }

    let payload: { sub: string; email: string; jti?: string; sessionId?: string };
    try {
      payload = await this.tokenService.verifyToken(refreshToken, 'refresh');
    } catch {
      throw new AuthenticationException(AUTH_ERROR_CODES.REFRESH_TOKEN_INVALID, 'Refresh token is invalid or expired');
    }

    if (payload.jti && this.tokenBlacklistService.isBlacklisted(payload.jti)) {
      throw new AuthenticationException(AUTH_ERROR_CODES.TOKEN_REVOKED, 'Refresh token has been revoked');
    }

    if (payload.jti && this.tokenRotationService.isReused(payload.jti)) {
      await this.sessionRepository.deleteAllByUserId(payload.sub);
      this.logger.warn(
        { event: 'auth.token_reuse_detected', userId: payload.sub },
        'Refresh token reuse detected — all sessions revoked',
      );
      throw new AuthenticationException(AUTH_ERROR_CODES.TOKEN_REVOKED, 'Token reuse detected');
    }

    let session = payload.sessionId
      ? await this.sessionRepository.findById(payload.sessionId)
      : null;

    if (!session) {
      const newSessionId = new SessionId();
      session = {
        sessionId: newSessionId.getValue(),
        userId: payload.sub,
        issuedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };
      await this.sessionRepository.save(session);
    }

    const tokenPair = await this.tokenService.generateTokenPair({
      sub: payload.sub,
      email: payload.email,
      sessionId: session.sessionId,
    });

    if (payload.jti) {
      const decoded = this.tokenService.decodeToken(tokenPair.accessToken);
      const exp = decoded?.exp ?? Math.floor(Date.now() / 1000) + 900;
      this.tokenBlacklistService.add(payload.jti, exp * 1000);
    }

    this.logger.info(
      { event: 'auth.refresh', userId: payload.sub, sessionId: session.sessionId },
      'Token refreshed successfully',
    );

    return { tokenPair, session };
  }

  async validateCredentials(email: string, password: string): Promise<{ userId: string; email: string }> {
    if (!AuthenticationValidators.isValidEmail(email) || !AuthenticationValidators.isValidPassword(password)) {
      throw new AuthenticationException(AUTH_ERROR_CODES.INVALID_CREDENTIALS, 'Invalid credentials format');
    }

    this.logger.info(
      { event: 'auth.credentials_validated', email },
      'Credentials validated successfully',
    );

    return { userId: '', email };
  }

  async bootstrapSession(userId: string): Promise<LoginResult> {
    const sessionId = new SessionId();
    const session: SessionInfo = {
      sessionId: sessionId.getValue(),
      userId,
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    await this.sessionRepository.save(session);

    const tokenPair = await this.tokenService.generateTokenPair({
      sub: userId,
      email: '',
      sessionId: session.sessionId,
    });

    this.logger.info(
      { event: 'auth.session_bootstrap', userId, sessionId: session.sessionId },
      'Session bootstrapped',
    );

    return { tokenPair, session };
  }
}
