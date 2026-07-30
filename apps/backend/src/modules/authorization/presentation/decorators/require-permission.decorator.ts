import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'authorization:permission';

export const RequirePermission = (...permissions: { resource: string; action: string }[]) =>
  SetMetadata(PERMISSION_KEY, permissions);
