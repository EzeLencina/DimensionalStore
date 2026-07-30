import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { CreateBrandCommand } from '../../../application/commands';

export class CreateBrandDto {
  @IsString() name!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @IsOptional()
  @IsEnum(['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'] as const)
  status?: string;

  @IsOptional()
  @IsEnum(['PUBLIC', 'PRIVATE'] as const)
  visibility?: string;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsBoolean()
  assignToAllProducts?: boolean;

  toCommand(tenantId: string): CreateBrandCommand {
    return new CreateBrandCommand(
      tenantId,
      this.name,
      this.slug,
      this.description,
      this.logoUrl,
      this.websiteUrl,
      this.status,
      this.visibility,
      this.seoTitle,
      this.seoDescription,
    );
  }
}
