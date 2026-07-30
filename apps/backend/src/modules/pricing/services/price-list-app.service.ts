import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { PriceList, PriceListId } from '../domain';
import { PricingException, PRICING_ERROR_CODES } from '../domain';
import { PricingValidator } from '../application/validators';
import { PriceListMapper } from '../application/mappers';
import { PRICE_LIST_REPOSITORY } from '../domain/repository';
import type { PriceListRepository } from '../domain/repository';
import type { PriceListResponseDto } from '../application/dto';
import { CreatePriceListCommand, UpdatePriceListCommand } from '../application/commands';

@Injectable()
export class PriceListAppService {
  constructor(
    @Inject(PRICE_LIST_REPOSITORY) private readonly repository: PriceListRepository,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async create(tenantId: string, command: CreatePriceListCommand): Promise<PriceListResponseDto> {
    const errors = PricingValidator.validateCreatePriceList(command);
    if (errors.length > 0) throw new PricingException(PRICING_ERROR_CODES.PRICING_INVALID_DATA, errors.join('; '));

    const existing = await this.repository.existsByCode(command.code, tenantId);
    if (existing) throw new PricingException(PRICING_ERROR_CODES.PRICE_LIST_CODE_ALREADY_EXISTS, `Code "${command.code}" already exists`);

    const pl = PriceList.create({ ...command, tenantId });
    await this.repository.save(pl);

    this.logger.info({ event: 'pricing.price-list.created', priceListId: pl.getId().toString(), tenantId }, 'PriceList created');
    return PriceListMapper.toResponse(pl);
  }

  async findById(id: string, tenantId: string): Promise<PriceListResponseDto> {
    const plId = new PriceListId(id);
    const pl = await this.repository.findById(plId, tenantId);
    if (!pl || pl.getTenantId() !== tenantId) throw new PricingException(PRICING_ERROR_CODES.PRICE_LIST_NOT_FOUND, 'PriceList not found');
    return PriceListMapper.toResponse(pl);
  }

  async findByCode(code: string, tenantId: string): Promise<PriceListResponseDto> {
    const pl = await this.repository.findByCode(code, tenantId);
    if (!pl) throw new PricingException(PRICING_ERROR_CODES.PRICE_LIST_NOT_FOUND, 'PriceList not found');
    return PriceListMapper.toResponse(pl);
  }

  async list(tenantId: string): Promise<PriceListResponseDto[]> {
    const items = await this.repository.list(tenantId);
    return items.map(PriceListMapper.toResponse);
  }

  async update(id: string, tenantId: string, command: UpdatePriceListCommand): Promise<PriceListResponseDto> {
    const errors = PricingValidator.validateUpdatePriceList(command);
    if (errors.length > 0) throw new PricingException(PRICING_ERROR_CODES.PRICING_INVALID_DATA, errors.join('; '));

    const plId = new PriceListId(id);
    const pl = await this.repository.findById(plId, tenantId);
    if (!pl || pl.getTenantId() !== tenantId) throw new PricingException(PRICING_ERROR_CODES.PRICE_LIST_NOT_FOUND, 'PriceList not found');

    if (command.name !== undefined) { (pl as any).name = command.name; }
    if (command.currency !== undefined) { (pl as any).currency = command.currency; }
    if (command.type !== undefined) { (pl as any).type = command.type as any; }
    if (command.priority !== undefined) { (pl as any).priority = command.priority; }
    if (command.channel !== undefined) { (pl as any).channel = command.channel; }
    if (command.customerGroup !== undefined) { (pl as any).customerGroup = command.customerGroup; }

    await this.repository.save(pl);
    this.logger.info({ event: 'pricing.price-list.updated', priceListId: id, tenantId }, 'PriceList updated');
    return PriceListMapper.toResponse(pl);
  }

  async activate(id: string, tenantId: string): Promise<PriceListResponseDto> {
    const plId = new PriceListId(id);
    const pl = await this.repository.findById(plId, tenantId);
    if (!pl || pl.getTenantId() !== tenantId) throw new PricingException(PRICING_ERROR_CODES.PRICE_LIST_NOT_FOUND, 'PriceList not found');
    pl.activate();
    await this.repository.save(pl);
    this.logger.info({ event: 'pricing.price-list.activated', priceListId: id, tenantId }, 'PriceList activated');
    return PriceListMapper.toResponse(pl);
  }

  async deactivate(id: string, tenantId: string): Promise<PriceListResponseDto> {
    const plId = new PriceListId(id);
    const pl = await this.repository.findById(plId, tenantId);
    if (!pl || pl.getTenantId() !== tenantId) throw new PricingException(PRICING_ERROR_CODES.PRICE_LIST_NOT_FOUND, 'PriceList not found');
    pl.deactivate();
    await this.repository.save(pl);
    this.logger.info({ event: 'pricing.price-list.deactivated', priceListId: id, tenantId }, 'PriceList deactivated');
    return PriceListMapper.toResponse(pl);
  }

  async setDefault(id: string, tenantId: string): Promise<PriceListResponseDto> {
    const plId = new PriceListId(id);
    const pl = await this.repository.findById(plId, tenantId);
    if (!pl || pl.getTenantId() !== tenantId) throw new PricingException(PRICING_ERROR_CODES.PRICE_LIST_NOT_FOUND, 'PriceList not found');

    const currentDefault = await this.repository.findDefault(tenantId);
    if (currentDefault && currentDefault.getId().toString() !== id) {
      currentDefault.unsetDefault();
      await this.repository.save(currentDefault);
    }

    pl.setAsDefault();
    await this.repository.save(pl);
    this.logger.info({ event: 'pricing.price-list.set-default', priceListId: id, tenantId }, 'PriceList set as default');
    return PriceListMapper.toResponse(pl);
  }

  async softDelete(id: string, tenantId: string): Promise<void> {
    const plId = new PriceListId(id);
    const pl = await this.repository.findById(plId, tenantId);
    if (!pl || pl.getTenantId() !== tenantId) throw new PricingException(PRICING_ERROR_CODES.PRICE_LIST_NOT_FOUND, 'PriceList not found');
    pl.softDelete();
    await this.repository.save(pl);
    this.logger.info({ event: 'pricing.price-list.deleted', priceListId: id, tenantId }, 'PriceList soft deleted');
  }
}
