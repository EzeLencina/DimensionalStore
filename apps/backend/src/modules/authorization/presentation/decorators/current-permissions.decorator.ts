import { createParamDecorator, ExecutionContext, Inject } from '@nestjs/common';

export const CurrentPermissions = createParamDecorator(
  async (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.__authorization?.permissions ?? [];
  },
);
