import { PipeTransform, Injectable } from '@nestjs/common';
import type { FilteringParams } from '../types';
import { FilteringService } from '../filtering';

@Injectable()
export class FilteringPipe implements PipeTransform {
  constructor(private readonly filteringService: FilteringService) {}

  transform(value: Record<string, unknown>): FilteringParams {
    const filter = value['filter'] as string | undefined;
    return this.filteringService.parse({ filter });
  }
}
