import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LocaleTimezoneMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    const context = req.tenantContext;

    if (context) {
      req.locale = context.settings.locale;
      req.timezone = context.settings.timezone;
      req.currency = context.settings.currency;
    } else {
      req.locale = req.headers['x-locale'] as string || 'es_AR';
      req.timezone = req.headers['x-timezone'] as string || 'America/Argentina/Buenos_Aires';
      req.currency = req.headers['x-currency'] as string || 'ARS';
    }

    next();
  }
}
