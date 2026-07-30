import { IsString, IsOptional, IsEnum } from 'class-validator';
import { UpdateBrandCommand } from '../../../application/commands';

export class UpdateBrandDto {
  @IsOptional()
  @IsString()
  name?: string;

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

  toCommand(): UpdateBrandCommand {
    return new UpdateBrandCommand(
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
