import { PipeTransform, Injectable } from '@nestjs/common';
import type { FieldSelectionParams } from '../types';
import { FieldSelectionService } from '../field-selection';

@Injectable()
export class FieldSelectionPipe implements PipeTransform {
  constructor(private readonly fieldSelectionService: FieldSelectionService) {}

  transform(value: Record<string, unknown>): FieldSelectionParams {
    const fields = value['fields'] as string | undefined;
    const expand = value['expand'] as string | undefined;
    const include = value['include'] as string | undefined;
    const exclude = value['exclude'] as string | undefined;

    return this.fieldSelectionService.parse({ fields, expand, include, exclude });
  }
}
