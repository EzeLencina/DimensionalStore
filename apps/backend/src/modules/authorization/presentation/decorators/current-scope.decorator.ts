import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentScope = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.__authorization?.scope ?? { type: 'global' };
  },
);
