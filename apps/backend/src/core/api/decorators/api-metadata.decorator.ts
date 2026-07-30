import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export function ApiMetadata(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiHeader({ name: 'x-request-id', required: false, description: 'Request ID for tracing' }),
    ApiHeader({ name: 'x-correlation-id', required: false, description: 'Correlation ID for distributed tracing' }),
  );
}
