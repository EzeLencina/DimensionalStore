import { PipeTransform, Injectable } from '@nestjs/common';
import { searchSchema } from '@tienda/schemas';

export interface SearchInput {
  q?: string;
  searchFields?: string[];
}

export interface SearchOutput {
  q?: string;
  searchFields?: string[];
}

@Injectable()
export class SearchPipe implements PipeTransform<SearchInput> {
  transform(value: SearchInput): SearchOutput {
    return searchSchema.parse(value ?? {});
  }
}
