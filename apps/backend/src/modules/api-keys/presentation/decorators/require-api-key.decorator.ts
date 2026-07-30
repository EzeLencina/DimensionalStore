import { SetMetadata } from '@nestjs/common';

export const API_KEYS_REQUIRED_KEY = 'api_keys_required';

export const RequireApiKey = () => SetMetadata(API_KEYS_REQUIRED_KEY, true);
