import { SetMetadata } from '@nestjs/common';

export const API_VERSION_METADATA = 'api:version';

export function ApiVersion(version: string): ClassDecorator & MethodDecorator {
  return SetMetadata(API_VERSION_METADATA, version);
}
