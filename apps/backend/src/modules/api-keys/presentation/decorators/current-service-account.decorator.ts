import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentServiceAccount = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const account = request.serviceAccount;
    return data ? account?.[data] : account;
  },
);
