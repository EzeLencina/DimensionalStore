import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentTenant = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const context = request.tenantContext;
    if (!context) return data ? undefined : null;
    if (data) {
      if (data === 'id') return context.tenant.id;
      if (data === 'slug') return context.tenant.slug;
      if (data === 'name') return context.tenant.name;
      if (data === 'settings') return context.settings;
      return (context as any)[data];
    }
    return context;
  },
);
