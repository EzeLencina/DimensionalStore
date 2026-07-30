import { Controller, Get, Post, Patch, Delete, Body, Param, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { VariantPriceAppService, PricingAppService } from '../../../services';
import { SetVariantPriceDto, SchedulePromotionDto } from '../dto';
import type { VariantPriceResponseDto, EffectivePriceResponseDto } from '../../../application/dto';
import { SetVariantPriceCommand, SchedulePromotionCommand } from '../../../application/commands';

@Controller('api/v1')
export class VariantPriceController {
  constructor(
    private readonly variantPriceAppService: VariantPriceAppService,
    private readonly pricingAppService: PricingAppService,
  ) {}

  private getTenantId(headers: Record<string, string>): string {
    return headers['x-tenant-id'] || 'default';
  }

  @Post('variants/:productVariantId/prices')
  @HttpCode(HttpStatus.CREATED)
  async setPrice(
    @Headers() headers: Record<string, string>,
    @Param('productVariantId') productVariantId: string,
    @Body() dto: SetVariantPriceDto,
  ): Promise<VariantPriceResponseDto> {
    const tenantId = this.getTenantId(headers);
    const command = new SetVariantPriceCommand(
      tenantId, dto.priceListId, productVariantId, '',
      dto.listAmount, dto.costAmount, dto.saleAmount, dto.minimumQuantity,
    );
    return this.variantPriceAppService.setPrice(tenantId, command);
  }

  @Get('variants/:productVariantId/prices')
  async listByVariant(@Headers() headers: Record<string, string>, @Param('productVariantId') productVariantId: string): Promise<VariantPriceResponseDto[]> {
    return this.variantPriceAppService.listByVariant(productVariantId, this.getTenantId(headers));
  }

  @Get('variants/:productVariantId/effective-price')
  async getEffectivePrice(@Headers() headers: Record<string, string>, @Param('productVariantId') productVariantId: string): Promise<EffectivePriceResponseDto> {
    return this.pricingAppService.resolveEffectivePrice(productVariantId, this.getTenantId(headers));
  }

  @Get('price-lists/:priceListId/prices')
  async listByPriceList(@Headers() headers: Record<string, string>, @Param('priceListId') priceListId: string): Promise<VariantPriceResponseDto[]> {
    return this.variantPriceAppService.listByPriceList(priceListId, this.getTenantId(headers));
  }

  @Get('variant-prices/:id')
  async findById(@Headers() headers: Record<string, string>, @Param('id') id: string): Promise<VariantPriceResponseDto> {
    return this.variantPriceAppService.findById(id, this.getTenantId(headers));
  }

  @Patch('variant-prices/:id/promotion')
  async schedulePromotion(@Headers() headers: Record<string, string>, @Param('id') id: string, @Body() dto: SchedulePromotionDto): Promise<VariantPriceResponseDto> {
    const tenantId = this.getTenantId(headers);
    const command = new SchedulePromotionCommand(tenantId, dto.promotionalAmount, dto.startsAt, dto.endsAt);
    return this.variantPriceAppService.schedulePromotion(id, tenantId, command);
  }

  @Delete('variant-prices/:id/promotion')
  @HttpCode(HttpStatus.OK)
  async cancelPromotion(@Headers() headers: Record<string, string>, @Param('id') id: string): Promise<VariantPriceResponseDto> {
    return this.variantPriceAppService.cancelPromotion(id, this.getTenantId(headers));
  }

  @Delete('variant-prices/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Headers() headers: Record<string, string>, @Param('id') id: string): Promise<void> {
    return this.variantPriceAppService.softDelete(id, this.getTenantId(headers));
  }
}
