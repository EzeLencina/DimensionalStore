import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';
import { mapZodErrorToValidationErrors, mapZodErrorToMessage } from '../mappers';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown): unknown {
    const parsed = this.schema.safeParse(value);

    if (parsed.success) {
      return parsed.data;
    }

    const errors = mapZodErrorToValidationErrors(parsed.error as ZodError);
    const message = mapZodErrorToMessage(parsed.error as ZodError);

    throw new BadRequestException({
      message,
      errors,
      statusCode: 400,
      error: 'Validation Failed',
    });
  }
}
