import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import type { ISessionService } from '../../application/interfaces';

@Injectable()
export class SessionOwnershipGuard implements CanActivate {
  constructor(
    @Inject('ISessionService')
    private readonly sessionService: ISessionService,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const targetSessionId = request.params['sessionId'] || request.headers['x-session-id'];

    if (!user?.userId || !targetSessionId) {
      throw new ForbiddenException('Cannot verify session ownership');
    }

    const session = await this.sessionService.getValidSession(targetSessionId);

    if (session.getUserId() !== user.userId) {
      this.logger.warn(
        { event: 'session.ownership_guard.mismatch', userId: user.userId, sessionUserId: session.getUserId() },
        'Session ownership mismatch',
      );
      throw new ForbiddenException('Session does not belong to this user');
    }

    return true;
  }
}
