import { SetMetadata } from '@nestjs/common';

export const SCOPES_KEY = 'api_scopes';

export const RequireScope = (...scopes: string[]) => SetMetadata(SCOPES_KEY, scopes);
