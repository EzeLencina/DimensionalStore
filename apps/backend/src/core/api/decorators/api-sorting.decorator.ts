import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiSorting(allowedFields?: string[]): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiQuery({
      name: 'sort',
      required: false,
      type: String,
      description: `Sort fields. Prefix with - for DESC, + for ASC. Comma-separated for multi-sort.${allowedFields ? ` Allowed: ${allowedFields.join(', ')}` : ''}`,
      example: '-createdAt,+name',
    }),
  );
}
