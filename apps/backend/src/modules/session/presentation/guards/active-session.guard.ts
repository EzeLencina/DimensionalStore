import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import type { ISessionService } from '../../application/interfaces';

@Injectable()
export class ActiveSessionGuard implements CanActivate {
  constructor(
    @Inject('ISessionService')
    private readonly sessionService: ISessionService,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const sessionId = request.headers['x-session-id'] as string;

    if (!user?.userId || !sessionId) {
      this.logger.warn({ event: 'session.active_guard.no_session' }, 'No session in request');
      throw new UnauthorizedException('Active session required');
    }

    try {
      const session = await this.sessionService.getValidSession(sessionId);
      request.session = session;
      return true;
    } catch (error) {
      this.logger.warn(
        { event: 'session.active_guard.rejected', userId: user.userId, sessionId },
        'Active session guard rejected',
      );
      throw new UnauthorizedException('Session is not active');
    }
  }
}
