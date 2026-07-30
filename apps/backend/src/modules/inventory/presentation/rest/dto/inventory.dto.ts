import { IsString, IsInt, Min, IsOptional, IsArray, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import {
  InitializeInventoryCommand, ReceiveStockCommand, DispatchStockCommand,
  AdjustStockCommand, ReserveStockCommand, TransferStockCommand, SetMinimumStockCommand,
} from '../../../application/commands';

export class InitializeInventoryDto {
  @IsString() productVariantId!: string;
  @IsString() sku!: string;
  @IsString() warehouseId!: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) quantity?: number;

  toCommand(tenantId: string): InitializeInventoryCommand {
    return new InitializeInventoryCommand(tenantId, this.productVariantId, this.sku, this.warehouseId, this.quantity);
  }
}

export class StockOperationDto {
  @IsString() sku!: string;
  @IsString() warehouseId!: string;
  @Type(() => Number) @IsInt() @Min(1) quantity!: number;
  @IsString() reason!: string;
  @IsString() createdBy!: string;
  @IsOptional() @IsString() referenceType?: string;
  @IsOptional() @IsString() referenceId?: string;
}

export class AdjustStockDto {
  @IsString() sku!: string;
  @IsString() warehouseId!: string;
  @Type(() => Number) @IsInt() @Min(0) newOnHand!: number;
  @IsString() reason!: string;
  @IsString() createdBy!: string;
}

export class ReserveStockDto {
  @IsString() sku!: string;
  @IsString() warehouseId!: string;
  @Type(() => Number) @IsInt() @Min(1) quantity!: number;
  @IsString() referenceType!: string;
  @IsString() referenceId!: string;
  @IsOptional() @IsDateString() expiresAt?: string;
}

export class TransferStockDto {
  @IsString() sku!: string;
  @IsString() fromWarehouseId!: string;
  @IsString() toWarehouseId!: string;
  @Type(() => Number) @IsInt() @Min(1) quantity!: number;
  @IsString() reason!: string;
  @IsString() createdBy!: string;
}

export class SetMinimumStockDto {
  @IsString() sku!: string;
  @IsString() warehouseId!: string;
  @Type(() => Number) @IsInt() @Min(0) minimumStock!: number;

  toCommand(tenantId: string): SetMinimumStockCommand {
    return new SetMinimumStockCommand(tenantId, this.sku, this.warehouseId, this.minimumStock);
  }
}

export class MovementQueryDto {
  @IsOptional() @IsString() productVariantId?: string;
  @IsOptional() @IsString() warehouseId?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number;
}
