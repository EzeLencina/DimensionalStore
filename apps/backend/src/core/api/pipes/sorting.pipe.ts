import { PipeTransform, Injectable } from '@nestjs/common';
import type { SortingParams } from '../types';
import { SortingService } from '../sorting';

@Injectable()
export class SortingPipe implements PipeTransform {
  constructor(private readonly sortingService: SortingService) {}

  transform(value: Record<string, unknown>): SortingParams {
    const sort = value['sort'] as string | undefined;
    return this.sortingService.parse({ sort });
  }
}
