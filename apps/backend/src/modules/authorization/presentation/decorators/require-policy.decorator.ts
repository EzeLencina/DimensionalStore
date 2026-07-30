import { SetMetadata } from '@nestjs/common';

export const POLICY_KEY = 'authorization:policy';

export const RequirePolicy = (...policies: { resource: string; action: string }[]) =>
  SetMetadata(POLICY_KEY, policies);
