import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { PriceListAppService } from '../../../services';
import { UpdatePriceListCommand } from '../../../application/commands';
import { CreatePriceListDto, UpdatePriceListDto } from '../dto';
import type { PriceListResponseDto } from '../../../application/dto';

@Controller('api/v1/price-lists')
export class PriceListController {
  constructor(private readonly priceListAppService: PriceListAppService) {}

  private getTenantId(headers: Record<string, string>): string {
    return headers['x-tenant-id'] || 'default';
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Headers() headers: Record<string, string>, @Body() dto: CreatePriceListDto): Promise<PriceListResponseDto> {
    return this.priceListAppService.create(this.getTenantId(headers), dto.toCommand(this.getTenantId(headers)));
  }

  @Get()
  async findAll(@Headers() headers: Record<string, string>): Promise<PriceListResponseDto[]> {
    return this.priceListAppService.list(this.getTenantId(headers));
  }

  @Get(':id')
  async findById(@Headers() headers: Record<string, string>, @Param('id') id: string): Promise<PriceListResponseDto> {
    return this.priceListAppService.findById(id, this.getTenantId(headers));
  }

  @Get('code/:code')
  async findByCode(@Headers() headers: Record<string, string>, @Param('code') code: string): Promise<PriceListResponseDto> {
    return this.priceListAppService.findByCode(code, this.getTenantId(headers));
  }

  @Put(':id')
  async update(@Headers() headers: Record<string, string>, @Param('id') id: string, @Body() dto: UpdatePriceListDto): Promise<PriceListResponseDto> {
    const tenantId = this.getTenantId(headers);
    const cmd = new UpdatePriceListCommand(
      dto.name, dto.currency, dto.type, dto.priority,
      dto.channel, dto.customerGroup, dto.startsAt, dto.endsAt,
    );
    return this.priceListAppService.update(id, tenantId, cmd);
  }

  @Patch(':id/activate')
  async activate(@Headers() headers: Record<string, string>, @Param('id') id: string): Promise<PriceListResponseDto> {
    return this.priceListAppService.activate(id, this.getTenantId(headers));
  }

  @Patch(':id/deactivate')
  async deactivate(@Headers() headers: Record<string, string>, @Param('id') id: string): Promise<PriceListResponseDto> {
    return this.priceListAppService.deactivate(id, this.getTenantId(headers));
  }

  @Patch(':id/default')
  async setDefault(@Headers() headers: Record<string, string>, @Param('id') id: string): Promise<PriceListResponseDto> {
    return this.priceListAppService.setDefault(id, this.getTenantId(headers));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Headers() headers: Record<string, string>, @Param('id') id: string): Promise<void> {
    return this.priceListAppService.softDelete(id, this.getTenantId(headers));
  }
}
