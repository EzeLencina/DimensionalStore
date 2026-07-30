import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiSearch(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiQuery({ name: 'search', required: false, type: String, description: 'Search query' }),
    ApiQuery({ name: 'searchFields', required: false, type: String, description: 'Comma-separated fields to search in (field search mode)' }),
    ApiQuery({ name: 'searchMode', required: false, enum: ['global', 'field'], description: 'Search mode' }),
  );
}
