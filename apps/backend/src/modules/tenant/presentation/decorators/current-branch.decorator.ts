import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentBranch = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const branch = request.tenantContext?.branch;
    if (!branch) return data ? undefined : null;
    if (data) return (branch as any)[data];
    return branch;
  },
);
