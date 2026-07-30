import { Injectable } from '@nestjs/common';
import { PriceListAppService } from './price-list-app.service';
import { VariantPriceAppService } from './variant-price-app.service';
import type { EffectivePriceResponseDto } from '../application/dto';

@Injectable()
export class PricingAppService {
  constructor(
    private readonly priceListAppService: PriceListAppService,
    private readonly variantPriceAppService: VariantPriceAppService,
  ) {}

  async resolveEffectivePrice(productVariantId: string, tenantId: string, channel?: string, customerGroup?: string): Promise<EffectivePriceResponseDto> {
    return this.variantPriceAppService.getEffectivePrice(productVariantId, tenantId);
  }
}
