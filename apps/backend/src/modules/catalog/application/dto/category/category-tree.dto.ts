import type { CategoryResponseDto } from './category-response.dto';

export type CategoryTreeDto = CategoryResponseDto & {
  children: CategoryTreeDto[];
};
