import { Controller, Get, Post, Body, Param, Query, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { InventoryAppService } from '../../../services';
import {
  InitializeInventoryDto, StockOperationDto, AdjustStockDto,
  ReserveStockDto, TransferStockDto, SetMinimumStockDto, MovementQueryDto,
} from '../dto';
import type { InventoryItemResponseDto, StockMovementResponseDto, StockReservationResponseDto, PaginatedResponseDto } from '../../../application/dto';

@Controller('api/v1/inventory')
export class InventoryController {
  constructor(private readonly inventoryAppService: InventoryAppService) {}

  private getTenantId(headers: Record<string, string>): string {
    return headers['x-tenant-id'] || 'default';
  }

  @Post('initialize')
  @HttpCode(HttpStatus.CREATED)
  async initialize(@Headers() headers: Record<string, string>, @Body() dto: InitializeInventoryDto): Promise<InventoryItemResponseDto> {
    return this.inventoryAppService.initialize(this.getTenantId(headers), dto.toCommand(this.getTenantId(headers)));
  }

  @Get('sku/:sku')
  async findBySku(@Headers() headers: Record<string, string>, @Param('sku') sku: string): Promise<InventoryItemResponseDto[]> {
    return this.inventoryAppService.findBySku(sku, this.getTenantId(headers));
  }

  @Get('warehouses/:warehouseId')
  async listByWarehouse(@Headers() headers: Record<string, string>, @Param('warehouseId') warehouseId: string): Promise<InventoryItemResponseDto[]> {
    return this.inventoryAppService.listByWarehouse(warehouseId, this.getTenantId(headers));
  }

  @Get('low-stock')
  async findLowStock(@Headers() headers: Record<string, string>, @Query('threshold') threshold?: string): Promise<InventoryItemResponseDto[]> {
    return this.inventoryAppService.findLowStock(this.getTenantId(headers), threshold ? Number(threshold) : undefined);
  }

  @Post('receive')
  @HttpCode(HttpStatus.OK)
  async receive(@Headers() headers: Record<string, string>, @Body() dto: StockOperationDto): Promise<InventoryItemResponseDto> {
    const tenantId = this.getTenantId(headers);
    return this.inventoryAppService.receiveStock(tenantId, { ...dto, tenantId } as any);
  }

  @Post('dispatch')
  @HttpCode(HttpStatus.OK)
  async dispatch(@Headers() headers: Record<string, string>, @Body() dto: StockOperationDto): Promise<InventoryItemResponseDto> {
    const tenantId = this.getTenantId(headers);
    return this.inventoryAppService.dispatchStock(tenantId, { ...dto, tenantId } as any);
  }

  @Post('adjust')
  @HttpCode(HttpStatus.OK)
  async adjust(@Headers() headers: Record<string, string>, @Body() dto: AdjustStockDto): Promise<InventoryItemResponseDto> {
    const tenantId = this.getTenantId(headers);
    return this.inventoryAppService.adjustStock(tenantId, { ...dto, tenantId } as any);
  }

  @Post('transfer')
  @HttpCode(HttpStatus.OK)
  async transfer(@Headers() headers: Record<string, string>, @Body() dto: TransferStockDto): Promise<void> {
    const tenantId = this.getTenantId(headers);
    return this.inventoryAppService.transferStock(tenantId, { ...dto, tenantId } as any);
  }

  @Post('reservations')
  @HttpCode(HttpStatus.CREATED)
  async reserve(@Headers() headers: Record<string, string>, @Body() dto: ReserveStockDto): Promise<StockReservationResponseDto> {
    const tenantId = this.getTenantId(headers);
    return this.inventoryAppService.reserveStock(tenantId, {
      ...dto, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null, tenantId, createdBy: 'api',
    } as any);
  }

  @Post('reservations/:id/release')
  @HttpCode(HttpStatus.OK)
  async releaseReservation(@Headers() headers: Record<string, string>, @Param('id') id: string): Promise<StockReservationResponseDto> {
    return this.inventoryAppService.releaseReservation(id, this.getTenantId(headers));
  }

  @Post('reservations/:id/consume')
  @HttpCode(HttpStatus.OK)
  async consumeReservation(@Headers() headers: Record<string, string>, @Param('id') id: string): Promise<StockReservationResponseDto> {
    return this.inventoryAppService.consumeReservation(id, this.getTenantId(headers));
  }

  @Get('movements')
  async listMovements(@Headers() headers: Record<string, string>, @Query() query: MovementQueryDto): Promise<PaginatedResponseDto<StockMovementResponseDto>> {
    return this.inventoryAppService.listMovements(this.getTenantId(headers), query.productVariantId, query.warehouseId, query.page, query.limit);
  }

  @Post('set-minimum-stock')
  @HttpCode(HttpStatus.OK)
  async setMinimumStock(@Headers() headers: Record<string, string>, @Body() dto: SetMinimumStockDto): Promise<InventoryItemResponseDto> {
    return this.inventoryAppService.setMinimumStock(this.getTenantId(headers), dto.toCommand(this.getTenantId(headers)));
  }
}
