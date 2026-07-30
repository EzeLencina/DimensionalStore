import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import type { ISessionService } from '../../application/interfaces';

@Injectable()
export class ValidSessionGuard implements CanActivate {
  constructor(
    @Inject('ISessionService')
    private readonly sessionService: ISessionService,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionId = request.headers['x-session-id'] as string;

    if (!sessionId) {
      this.logger.warn({ event: 'session.valid_guard.no_session_id' }, 'No session ID in request');
      throw new UnauthorizedException('Session ID required');
    }

    try {
      const session = await this.sessionService.getValidSession(sessionId);
      request.session = session;
      request.user = { ...request.user, userId: session.getUserId() };
      return true;
    } catch (error) {
      this.logger.warn(
        { event: 'session.valid_guard.invalid', sessionId },
        'Valid session guard rejected',
      );
      throw new UnauthorizedException('Invalid or expired session');
    }
  }
}
