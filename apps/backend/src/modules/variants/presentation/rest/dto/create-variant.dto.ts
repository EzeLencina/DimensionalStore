import { IsString, IsOptional, IsArray, IsBoolean, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateVariantCommand } from '../../../application/commands';

class AttributeDto {
  @IsString() name!: string;
  @IsString() value!: string;
}

export class CreateVariantDto {
  @IsString() sku!: string;

  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() barcode?: string;

  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE', 'ARCHIVED'] as const)
  status?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeDto)
  attributes?: AttributeDto[];

  @IsOptional() @IsBoolean() isDefault?: boolean;

  toCommand(tenantId: string, productId: string): CreateVariantCommand {
    return new CreateVariantCommand(
      tenantId, productId, this.sku,
      this.name, this.barcode, this.status,
      this.attributes, this.isDefault,
    );
  }
}
