import { applyDecorators } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

export function ApiPagination(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (starts at 1)' }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    ApiResponse({
      status: 200,
      description: 'Paginated response',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { type: 'array' },
          meta: {
            type: 'object',
            properties: {
              pagination: {
                type: 'object',
                properties: {
                  page: { type: 'number' },
                  limit: { type: 'number' },
                  totalCount: { type: 'number' },
                  totalPages: { type: 'number' },
                  hasNextPage: { type: 'boolean' },
                  hasPreviousPage: { type: 'boolean' },
                },
              },
            },
          },
        },
      },
    }),
  );
}
