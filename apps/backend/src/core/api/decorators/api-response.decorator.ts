import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse as SwaggerResponse, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

export function ApiStandardResponse<TModel extends Type<unknown>>(
  model: TModel,
  status = 200,
  description = 'Successful operation',
): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiExtraModels(model),
    SwaggerResponse({
      status,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          statusCode: { type: 'number' },
          message: { type: 'string' },
          data: { $ref: getSchemaPath(model) },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  );
}

export function ApiArrayResponse<TModel extends Type<unknown>>(
  model: TModel,
  status = 200,
  description = 'Successful operation',
): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiExtraModels(model),
    SwaggerResponse({
      status,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          statusCode: { type: 'number' },
          message: { type: 'string' },
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(model) },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  );
}

export function ApiPaginatedResponse<TModel extends Type<unknown>>(
  model: TModel,
  description = 'Paginated response',
): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiExtraModels(model),
    SwaggerResponse({
      status: 200,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          statusCode: { type: 'number' },
          message: { type: 'string' },
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(model) },
          },
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
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  );
}
