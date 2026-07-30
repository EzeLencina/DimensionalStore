import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform<string> {
  constructor(private readonly fieldName = 'date') {}

  transform(value: string): Date {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException({
        message: `Invalid date for field "${this.fieldName}": ${value}`,
        statusCode: 400,
        error: 'Validation Failed',
      });
    }

    return date;
  }
}
