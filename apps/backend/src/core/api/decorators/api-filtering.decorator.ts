import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiFiltering(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiQuery({
      name: 'filter',
      required: false,
      type: String,
      description: 'JSON filter expression. Example: [{"logic":"AND","conditions":[{"field":"status","operator":"eq","value":"active"}]}]',
    }),
  );
}
