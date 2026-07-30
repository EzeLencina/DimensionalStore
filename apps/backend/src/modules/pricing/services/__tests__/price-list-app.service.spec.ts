jest.mock('@tienda/logger/nest', () => ({ LOGGER_TOKEN: 'ILogger' }));

import { PriceListAppService } from '../price-list-app.service';
import { InMemoryPriceListRepository } from '../../infrastructure/persistence/in-memory/in-memory-price-list.repository';
import { PricingException } from '../../domain/exceptions';
import { CreatePriceListCommand, UpdatePriceListCommand } from '../../application/commands';

describe('PriceListAppService', () => {
  let service: PriceListAppService;
  let repository: InMemoryPriceListRepository;

  beforeEach(() => {
    repository = new InMemoryPriceListRepository();
    const logger = { info: jest.fn(), debug: jest.fn(), warn: jest.fn(), error: jest.fn() };
    service = new PriceListAppService(repository as any, logger as any);
  });

  describe('create', () => {
    it('should create a price list', async () => {
      const cmd = new CreatePriceListCommand('tenant-1', 'Lista Retail', 'RETAIL');
      const result = await service.create('tenant-1', cmd);
      expect(result.id).toBeDefined();
      expect(result.name).toBe('Lista Retail');
      expect(result.code).toBe('RETAIL');
      expect(result.status).toBe('ACTIVE');
    });

    it('should throw on duplicate code', async () => {
      const cmd = new CreatePriceListCommand('tenant-1', 'Lista Retail', 'RETAIL');
      await service.create('tenant-1', cmd);
      await expect(service.create('tenant-1', cmd)).rejects.toThrow(PricingException);
    });

    it('should throw on invalid data', async () => {
      const cmd = new CreatePriceListCommand('tenant-1', '', '');
      await expect(service.create('tenant-1', cmd)).rejects.toThrow(PricingException);
    });
  });

  describe('findById', () => {
    it('should find by id', async () => {
      const cmd = new CreatePriceListCommand('tenant-1', 'Test', 'TEST');
      const created = await service.create('tenant-1', cmd);
      const found = await service.findById(created.id, 'tenant-1');
      expect(found.id).toBe(created.id);
    });

    it('should throw on tenant mismatch', async () => {
      const cmd = new CreatePriceListCommand('tenant-1', 'Test', 'TEST');
      const created = await service.create('tenant-1', cmd);
      await expect(service.findById(created.id, 'tenant-2')).rejects.toThrow(PricingException);
    });
  });

  describe('list', () => {
    it('should list all price lists for tenant', async () => {
      await service.create('tenant-1', new CreatePriceListCommand('tenant-1', 'A', 'A'));
      await service.create('tenant-1', new CreatePriceListCommand('tenant-1', 'B', 'B'));
      const items = await service.list('tenant-1');
      expect(items).toHaveLength(2);
    });
  });

  describe('update', () => {
    it('should update name', async () => {
      const created = await service.create('tenant-1', new CreatePriceListCommand('tenant-1', 'Old', 'OLD'));
      const cmd = new UpdatePriceListCommand('New Name');
      const result = await service.update(created.id, 'tenant-1', cmd);
      expect(result.name).toBe('New Name');
    });
  });

  describe('activate/deactivate', () => {
    it('should deactivate and activate', async () => {
      const created = await service.create('tenant-1', new CreatePriceListCommand('tenant-1', 'Test', 'TEST'));
      const deactivated = await service.deactivate(created.id, 'tenant-1');
      expect(deactivated.status).toBe('INACTIVE');
      const activated = await service.activate(created.id, 'tenant-1');
      expect(activated.status).toBe('ACTIVE');
    });
  });

  describe('setDefault', () => {
    it('should set as default', async () => {
      const created = await service.create('tenant-1', new CreatePriceListCommand('tenant-1', 'Test', 'TEST'));
      const result = await service.setDefault(created.id, 'tenant-1');
      expect(result.isDefault).toBe(true);
    });
  });

  describe('softDelete', () => {
    it('should soft delete', async () => {
      const created = await service.create('tenant-1', new CreatePriceListCommand('tenant-1', 'Test', 'TEST'));
      await service.softDelete(created.id, 'tenant-1');
      const found = await service.findById(created.id, 'tenant-1');
      expect(found.deletedAt).not.toBeNull();
    });
  });
});
