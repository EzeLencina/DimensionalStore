import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { CreateWarehouseCommand } from '../../../application/commands';

export class CreateWarehouseDto {
  @IsString() name!: string;
  @IsString() code!: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsEnum(['ACTIVE', 'INACTIVE'] as const) status?: string;
  @IsOptional() @IsBoolean() isDefault?: boolean;

  toCommand(tenantId: string): CreateWarehouseCommand {
    return new CreateWarehouseCommand(tenantId, this.name, this.code, this.address, this.status, this.isDefault);
  }
}
