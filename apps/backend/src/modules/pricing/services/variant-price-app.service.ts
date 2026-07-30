import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { VariantPrice, VariantPriceId, PriceListId } from '../domain';
import { PricingException, PRICING_ERROR_CODES } from '../domain';
import { PricingValidator } from '../application/validators';
import { VariantPriceMapper } from '../application/mappers';
import { VARIANT_PRICE_REPOSITORY, PRICE_LIST_REPOSITORY, PRICE_HISTORY_REPOSITORY } from '../domain/repository';
import type { VariantPriceRepository, PriceListRepository, PriceHistoryRepository } from '../domain/repository';
import type { VariantPriceResponseDto, EffectivePriceResponseDto } from '../application/dto';
import { SetVariantPriceCommand, SchedulePromotionCommand } from '../application/commands';

@Injectable()
export class VariantPriceAppService {
  constructor(
    @Inject(VARIANT_PRICE_REPOSITORY) private readonly repository: VariantPriceRepository,
    @Inject(PRICE_LIST_REPOSITORY) private readonly priceListRepo: PriceListRepository,
    @Inject(PRICE_HISTORY_REPOSITORY) private readonly historyRepo: PriceHistoryRepository,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async setPrice(tenantId: string, command: SetVariantPriceCommand): Promise<VariantPriceResponseDto> {
    const errors = PricingValidator.validateSetVariantPrice(command);
    if (errors.length > 0) throw new PricingException(PRICING_ERROR_CODES.PRICING_INVALID_DATA, errors.join('; '));

    const priceList = await this.priceListRepo.findById(new PriceListId(command.priceListId), tenantId);
    if (!priceList) throw new PricingException(PRICING_ERROR_CODES.PRICE_LIST_NOT_FOUND, 'PriceList not found');

    const existing = await this.repository.findByVariantAndList(command.productVariantId, command.priceListId, tenantId);
    if (existing) {
      const oldList = existing.getListAmount().toCents();
      existing.updatePricing(command.costAmount ?? null, command.listAmount, command.saleAmount ?? null);
      await this.repository.save(existing);
      await this.historyRepo.append({
        tenantId, variantPriceId: existing.getId().toString(),
        productVariantId: existing.getProductVariantId(),
        changeType: 'PRICE_UPDATE',
        previousValues: { listAmount: oldList, costAmount: command.costAmount, saleAmount: command.saleAmount },
        newValues: { listAmount: command.listAmount, costAmount: command.costAmount, saleAmount: command.saleAmount },
        changedBy: 'system',
      });
      this.logger.info({ event: 'pricing.variant-price.updated', variantPriceId: existing.getId().toString(), tenantId }, 'VariantPrice updated');
      return VariantPriceMapper.toResponse(existing);
    }

    const vp = VariantPrice.create({ ...command, tenantId });
    await this.repository.save(vp);
    await this.historyRepo.append({
      tenantId, variantPriceId: vp.getId().toString(),
      productVariantId: vp.getProductVariantId(),
      changeType: 'PRICE_CREATED',
      previousValues: {}, newValues: { listAmount: command.listAmount },
      changedBy: 'system',
    });
    this.logger.info({ event: 'pricing.variant-price.created', variantPriceId: vp.getId().toString(), tenantId }, 'VariantPrice created');
    return VariantPriceMapper.toResponse(vp);
  }

  async findById(id: string, tenantId: string): Promise<VariantPriceResponseDto> {
    const vpId = new VariantPriceId(id);
    const vp = await this.repository.findById(vpId, tenantId);
    if (!vp || vp.getTenantId() !== tenantId) throw new PricingException(PRICING_ERROR_CODES.VARIANT_PRICE_NOT_FOUND, 'VariantPrice not found');
    return VariantPriceMapper.toResponse(vp);
  }

  async listByVariant(productVariantId: string, tenantId: string): Promise<VariantPriceResponseDto[]> {
    const items = await this.repository.listByVariant(productVariantId, tenantId);
    return items.map(VariantPriceMapper.toResponse);
  }

  async listByPriceList(priceListId: string, tenantId: string): Promise<VariantPriceResponseDto[]> {
    const items = await this.repository.listByPriceList(priceListId, tenantId);
    return items.map(VariantPriceMapper.toResponse);
  }

  async getEffectivePrice(productVariantId: string, tenantId: string): Promise<EffectivePriceResponseDto> {
    const prices = await this.repository.findApplicablePrices(productVariantId, tenantId);
    if (prices.length === 0) throw new PricingException(PRICING_ERROR_CODES.NO_APPLICABLE_PRICE, 'No applicable price found for variant');

    const applicable = prices.filter(vp => !vp.toPrimitives().deletedAt);
    if (applicable.length === 0) throw new PricingException(PRICING_ERROR_CODES.NO_APPLICABLE_PRICE, 'No applicable price found for variant');

    const vp = applicable[0]!;
    const priceList = await this.priceListRepo.findById(new PriceListId(vp.getPriceListId()), tenantId);
    return VariantPriceMapper.toEffectivePrice(vp, priceList?.toPrimitives().name ?? 'Default');
  }

  async schedulePromotion(id: string, tenantId: string, command: SchedulePromotionCommand): Promise<VariantPriceResponseDto> {
    const errors = PricingValidator.validateSchedulePromotion(command);
    if (errors.length > 0) throw new PricingException(PRICING_ERROR_CODES.PRICING_INVALID_DATA, errors.join('; '));

    const vpId = new VariantPriceId(id);
    const vp = await this.repository.findById(vpId, tenantId);
    if (!vp || vp.getTenantId() !== tenantId) throw new PricingException(PRICING_ERROR_CODES.VARIANT_PRICE_NOT_FOUND, 'VariantPrice not found');

    const oldPromo = vp.getPromotionalAmount()?.toCents() ?? null;
    vp.schedulePromotion(command.promotionalAmount, command.startsAt, command.endsAt);
    await this.repository.save(vp);
    await this.historyRepo.append({
      tenantId, variantPriceId: id,
      productVariantId: vp.getProductVariantId(),
      changeType: 'PROMOTION_SCHEDULED',
      previousValues: { promotionalAmount: oldPromo },
      newValues: { promotionalAmount: command.promotionalAmount, startsAt: command.startsAt, endsAt: command.endsAt },
      changedBy: 'system',
    });
    this.logger.info({ event: 'pricing.variant-price.promotion-scheduled', variantPriceId: id, tenantId }, 'Promotion scheduled');
    return VariantPriceMapper.toResponse(vp);
  }

  async cancelPromotion(id: string, tenantId: string): Promise<VariantPriceResponseDto> {
    const vpId = new VariantPriceId(id);
    const vp = await this.repository.findById(vpId, tenantId);
    if (!vp || vp.getTenantId() !== tenantId) throw new PricingException(PRICING_ERROR_CODES.VARIANT_PRICE_NOT_FOUND, 'VariantPrice not found');

    vp.cancelPromotion();
    await this.repository.save(vp);
    await this.historyRepo.append({
      tenantId, variantPriceId: id,
      productVariantId: vp.getProductVariantId(),
      changeType: 'PROMOTION_CANCELLED',
      previousValues: {}, newValues: { promotionalAmount: null },
      changedBy: 'system',
    });
    this.logger.info({ event: 'pricing.variant-price.promotion-cancelled', variantPriceId: id, tenantId }, 'Promotion cancelled');
    return VariantPriceMapper.toResponse(vp);
  }

  async softDelete(id: string, tenantId: string): Promise<void> {
    const vpId = new VariantPriceId(id);
    const vp = await this.repository.findById(vpId, tenantId);
    if (!vp || vp.getTenantId() !== tenantId) throw new PricingException(PRICING_ERROR_CODES.VARIANT_PRICE_NOT_FOUND, 'VariantPrice not found');
    vp.softDelete();
    await this.repository.save(vp);
    this.logger.info({ event: 'pricing.variant-price.deleted', variantPriceId: id, tenantId }, 'VariantPrice soft deleted');
  }
}
