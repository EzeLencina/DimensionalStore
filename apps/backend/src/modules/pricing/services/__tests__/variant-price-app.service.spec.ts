jest.mock('@tienda/logger/nest', () => ({ LOGGER_TOKEN: 'ILogger' }));

import { VariantPriceAppService } from '../variant-price-app.service';
import { InMemoryVariantPriceRepository } from '../../infrastructure/persistence/in-memory/in-memory-variant-price.repository';
import { InMemoryPriceListRepository } from '../../infrastructure/persistence/in-memory/in-memory-price-list.repository';
import { InMemoryPriceHistoryRepository } from '../../infrastructure/persistence/in-memory/in-memory-price-history.repository';
import { PricingException } from '../../domain/exceptions';
import { PriceList, VariantPrice } from '../../domain';
import { SetVariantPriceCommand, SchedulePromotionCommand } from '../../application/commands';

describe('VariantPriceAppService', () => {
  let service: VariantPriceAppService;
  let vpRepo: InMemoryVariantPriceRepository;
  let plRepo: InMemoryPriceListRepository;
  let historyRepo: InMemoryPriceHistoryRepository;
  let priceList: PriceList;

  beforeEach(async () => {
    vpRepo = new InMemoryVariantPriceRepository();
    plRepo = new InMemoryPriceListRepository();
    historyRepo = new InMemoryPriceHistoryRepository();
    const logger = { info: jest.fn(), debug: jest.fn(), warn: jest.fn(), error: jest.fn() };

    priceList = PriceList.create({ tenantId: 'tenant-1', name: 'Retail', code: 'RETAIL' });
    await plRepo.save(priceList);

    service = new VariantPriceAppService(vpRepo as any, plRepo as any, historyRepo as any, logger as any);
  });

  describe('setPrice', () => {
    it('should create a variant price', async () => {
      const cmd = new SetVariantPriceCommand('tenant-1', priceList.getId().toString(), 'pv-1', 'SKU-001', 10000);
      const result = await service.setPrice('tenant-1', cmd);
      expect(result.id).toBeDefined();
      expect(result.listAmount).toBe(10000);
      expect(result.listAmount).toBe(10000);
    });

    it('should update existing variant price', async () => {
      const cmd = new SetVariantPriceCommand('tenant-1', priceList.getId().toString(), 'pv-1', 'SKU-001', 10000);
      await service.setPrice('tenant-1', cmd);
      const cmd2 = new SetVariantPriceCommand('tenant-1', priceList.getId().toString(), 'pv-1', 'SKU-001', 12000);
      const result = await service.setPrice('tenant-1', cmd2);
      expect(result.listAmount).toBe(12000);
    });
  });

  describe('getEffectivePrice', () => {
    it('should return effective price', async () => {
      const cmd = new SetVariantPriceCommand('tenant-1', priceList.getId().toString(), 'pv-1', 'SKU-001', 10000);
      await service.setPrice('tenant-1', cmd);
      const result = await service.getEffectivePrice('pv-1', 'tenant-1');
      expect(result.effectiveAmount).toBe(10000);
    });

    it('should throw when no prices', async () => {
      await expect(service.getEffectivePrice('pv-none', 'tenant-1')).rejects.toThrow(PricingException);
    });
  });

  describe('promotion', () => {
    it('should schedule and cancel promotion', async () => {
      const cmd = new SetVariantPriceCommand('tenant-1', priceList.getId().toString(), 'pv-1', 'SKU-001', 10000);
      const created = await service.setPrice('tenant-1', cmd);

      const promoCmd = new SchedulePromotionCommand('tenant-1', 7000, new Date('2026-01-01'), new Date('2026-12-31'));
      const withPromo = await service.schedulePromotion(created.id, 'tenant-1', promoCmd);
      expect(withPromo.hasActivePromotion).toBe(true);

      const cancelled = await service.cancelPromotion(created.id, 'tenant-1');
      expect(cancelled.hasActivePromotion).toBe(false);
    });
  });

  describe('findById', () => {
    it('should find by id', async () => {
      const cmd = new SetVariantPriceCommand('tenant-1', priceList.getId().toString(), 'pv-1', 'SKU-001', 10000);
      const created = await service.setPrice('tenant-1', cmd);
      const found = await service.findById(created.id, 'tenant-1');
      expect(found.id).toBe(created.id);
    });
  });

  describe('softDelete', () => {
    it('should soft delete', async () => {
      const cmd = new SetVariantPriceCommand('tenant-1', priceList.getId().toString(), 'pv-1', 'SKU-001', 10000);
      const created = await service.setPrice('tenant-1', cmd);
      await service.softDelete(created.id, 'tenant-1');
      const found = await service.findById(created.id, 'tenant-1');
      expect(found.deletedAt).not.toBeNull();
    });
  });
});
