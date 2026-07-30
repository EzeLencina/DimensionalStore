import { IsOptional, IsString, IsEnum, IsInt, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import type { BrandListQueryDto as BrandListQueryInterface } from '../../../application/dto';

export class BrandListQueryDto implements BrandListQueryInterface {
  @IsOptional()
  @IsEnum(['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'] as const)
  status?: string;

  @IsOptional()
  @IsEnum(['PUBLIC', 'PRIVATE'] as const)
  visibility?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortField?: string;

  @IsOptional()
  @IsEnum(['asc', 'desc'] as const)
  sortDirection?: string;

  @IsOptional()
  @IsBoolean()
  includeDeleted?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
