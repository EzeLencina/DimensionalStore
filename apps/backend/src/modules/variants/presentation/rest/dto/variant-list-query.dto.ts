import { IsOptional, IsString, IsEnum, IsInt, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class VariantListQueryDto {
  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE', 'ARCHIVED'] as const)
  status?: string;

  @IsOptional() @IsString() search?: string;

  @IsOptional() @IsBoolean() includeDeleted?: boolean;

  @IsOptional() @IsString() sortField?: string;

  @IsOptional()
  @IsEnum(['asc', 'desc'] as const)
  sortDirection?: string;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number;
}
