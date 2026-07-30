import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiFieldSelection(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiQuery({ name: 'fields', required: false, type: String, description: 'Comma-separated fields to include in response' }),
    ApiQuery({ name: 'expand', required: false, type: String, description: 'Comma-separated related resources to expand' }),
    ApiQuery({ name: 'include', required: false, type: String, description: 'Comma-separated additional fields to include' }),
    ApiQuery({ name: 'exclude', required: false, type: String, description: 'Comma-separated fields to exclude from response' }),
  );
}
