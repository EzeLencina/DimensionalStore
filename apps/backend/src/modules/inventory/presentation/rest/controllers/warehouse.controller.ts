import { Controller, Get, Post, Body, Param, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { WarehouseAppService } from '../../../services';
import { CreateWarehouseDto } from '../dto';
import type { WarehouseResponseDto } from '../../../application/dto';

@Controller('api/v1/warehouses')
export class WarehouseController {
  constructor(private readonly warehouseAppService: WarehouseAppService) {}

  private getTenantId(headers: Record<string, string>): string {
    return headers['x-tenant-id'] || 'default';
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Headers() headers: Record<string, string>, @Body() dto: CreateWarehouseDto): Promise<WarehouseResponseDto> {
    return this.warehouseAppService.create(this.getTenantId(headers), dto.toCommand(this.getTenantId(headers)));
  }

  @Get()
  async list(@Headers() headers: Record<string, string>): Promise<WarehouseResponseDto[]> {
    return this.warehouseAppService.list(this.getTenantId(headers));
  }

  @Post(':id/default')
  @HttpCode(HttpStatus.OK)
  async setDefault(@Headers() headers: Record<string, string>, @Param('id') id: string): Promise<WarehouseResponseDto> {
    return this.warehouseAppService.setDefault(id, this.getTenantId(headers));
  }

  @Get(':id')
  async findById(@Headers() headers: Record<string, string>, @Param('id') id: string): Promise<WarehouseResponseDto> {
    return this.warehouseAppService.findById(id, this.getTenantId(headers));
  }
}
