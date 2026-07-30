jest.mock('@tienda/logger/nest', () => ({
  LOGGER_TOKEN: 'ILogger',
}));

import { VariantAppService } from '../variant-app.service';
import { InMemoryVariantRepository } from '../../infrastructure/persistence/in-memory/in-memory-variant.repository';
import { VariantException } from '../../domain/exceptions';
import { CreateVariantCommand, UpdateVariantCommand, ChangeVariantSkuCommand, ChangeVariantStatusCommand } from '../../application/commands';

describe('VariantAppService', () => {
  let service: VariantAppService;
  let repository: InMemoryVariantRepository;

  beforeEach(() => {
    repository = new InMemoryVariantRepository();
    const logger = { info: jest.fn(), debug: jest.fn(), warn: jest.fn(), error: jest.fn() };
    service = new VariantAppService(repository as any, logger as any);
  });

  describe('create', () => {
    it('should create a variant', async () => {
      const command = new CreateVariantCommand('tenant-1', 'product-1', 'T1PRO-NEGRA');
      const result = await service.create('tenant-1', 'product-1', command);

      expect(result.id).toBeDefined();
      expect(result.sku).toBe('T1PRO-NEGRA');
      expect(result.productId).toBe('product-1');
      expect(result.status).toBe('ACTIVE');
      expect(result.tenantId).toBe('tenant-1');
    });

    it('should throw on duplicate SKU', async () => {
      const command = new CreateVariantCommand('tenant-1', 'product-1', 'T1PRO-NEGRA');
      await service.create('tenant-1', 'product-1', command);

      const command2 = new CreateVariantCommand('tenant-1', 'product-2', 'T1PRO-NEGRA');
      await expect(service.create('tenant-1', 'product-2', command2)).rejects.toThrow(VariantException);
    });

    it('should allow same SKU in different tenant', async () => {
      const command = new CreateVariantCommand('tenant-1', 'product-1', 'T1PRO-NEGRA');
      await service.create('tenant-1', 'product-1', command);

      const command2 = new CreateVariantCommand('tenant-2', 'product-1', 'T1PRO-NEGRA');
      const result = await service.create('tenant-2', 'product-1', command2);
      expect(result.sku).toBe('T1PRO-NEGRA');
    });

    it('should throw on invalid data', async () => {
      const command = new CreateVariantCommand('tenant-1', 'product-1', '');
      await expect(service.create('tenant-1', 'product-1', command)).rejects.toThrow(VariantException);
    });

    it('should create with default variant and unset existing default', async () => {
      const cmd1 = new CreateVariantCommand('tenant-1', 'product-1', 'SKU-001', null, null, undefined, undefined, true);
      const v1 = await service.create('tenant-1', 'product-1', cmd1);
      expect(v1.isDefault).toBe(true);

      const cmd2 = new CreateVariantCommand('tenant-1', 'product-1', 'SKU-002', null, null, undefined, undefined, true);
      const v2 = await service.create('tenant-1', 'product-1', cmd2);
      expect(v2.isDefault).toBe(true);

      const updated1 = await service.findById(v1.id, 'tenant-1');
      expect(updated1.isDefault).toBe(false);
    });

    it('should throw on duplicate attribute combination', async () => {
      const attrs = [{ name: 'color', value: 'Negra' }];
      const cmd1 = new CreateVariantCommand('tenant-1', 'product-1', 'SKU-001', null, null, undefined, attrs);
      await service.create('tenant-1', 'product-1', cmd1);

      const cmd2 = new CreateVariantCommand('tenant-1', 'product-1', 'SKU-002', null, null, undefined, attrs);
      await expect(service.create('tenant-1', 'product-1', cmd2)).rejects.toThrow(VariantException);
    });
  });

  describe('findById', () => {
    it('should find variant by id', async () => {
      const command = new CreateVariantCommand('tenant-1', 'product-1', 'T1PRO-NEGRA');
      const created = await service.create('tenant-1', 'product-1', command);
      const found = await service.findById(created.id, 'tenant-1');
      expect(found.sku).toBe('T1PRO-NEGRA');
    });

    it('should throw on not found', async () => {
      await expect(service.findById('non-existent', 'tenant-1')).rejects.toThrow(VariantException);
    });
  });

  describe('findBySku', () => {
    it('should find by SKU', async () => {
      await service.create('tenant-1', 'product-1', new CreateVariantCommand('tenant-1', 'product-1', 'T1PRO-NEGRA'));
      const found = await service.findBySku('T1PRO-NEGRA', 'tenant-1');
      expect(found.sku).toBe('T1PRO-NEGRA');
    });

    it('should throw on not found', async () => {
      await expect(service.findBySku('NONEXISTENT', 'tenant-1')).rejects.toThrow(VariantException);
    });
  });

  describe('listByProduct', () => {
    it('should list variants for a product', async () => {
      await service.create('tenant-1', 'product-1', new CreateVariantCommand('tenant-1', 'product-1', 'SKU-001'));
      await service.create('tenant-1', 'product-1', new CreateVariantCommand('tenant-1', 'product-1', 'SKU-002'));

      const result = await service.listByProduct('product-1', 'tenant-1', {});
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should filter by status', async () => {
      await service.create('tenant-1', 'product-1', new CreateVariantCommand('tenant-1', 'product-1', 'SKU-001'));
      const cmd2 = new CreateVariantCommand('tenant-1', 'product-1', 'SKU-002', null, null, 'INACTIVE');
      await service.create('tenant-1', 'product-1', cmd2);

      const result = await service.listByProduct('product-1', 'tenant-1', { status: 'INACTIVE' });
      expect(result.data).toHaveLength(1);
      expect(result.data[0].sku).toBe('SKU-002');
    });
  });

  describe('update', () => {
    it('should update name and barcode', async () => {
      const created = await service.create('tenant-1', 'product-1', new CreateVariantCommand('tenant-1', 'product-1', 'T1PRO-NEGRA'));
      const result = await service.update(created.id, 'tenant-1', new UpdateVariantCommand('Updated Name', '123456789012'));
      expect(result.name).toBe('Updated Name');
      expect(result.barcode).toBe('123456789012');
    });

    it('should throw on not found', async () => {
      await expect(service.update('non-existent', 'tenant-1', new UpdateVariantCommand('Name'))).rejects.toThrow(VariantException);
    });
  });

  describe('changeSku', () => {
    it('should change SKU', async () => {
      const created = await service.create('tenant-1', 'product-1', new CreateVariantCommand('tenant-1', 'product-1', 'SKU-001'));
      const result = await service.changeSku(created.id, 'tenant-1', new ChangeVariantSkuCommand('SKU-002'));
      expect(result.sku).toBe('SKU-002');
    });

    it('should throw on duplicate SKU', async () => {
      await service.create('tenant-1', 'product-1', new CreateVariantCommand('tenant-1', 'product-1', 'SKU-001'));
      const v2 = await service.create('tenant-1', 'product-1', new CreateVariantCommand('tenant-1', 'product-1', 'SKU-002'));
      await expect(service.changeSku(v2.id, 'tenant-1', new ChangeVariantSkuCommand('SKU-001'))).rejects.toThrow(VariantException);
    });
  });

  describe('changeStatus', () => {
    it('should activate variant', async () => {
      const created = await service.create('tenant-1', 'product-1', new CreateVariantCommand('tenant-1', 'product-1', 'SKU-001', null, null, 'INACTIVE'));
      const result = await service.changeStatus(created.id, 'tenant-1', new ChangeVariantStatusCommand('ACTIVE'));
      expect(result.status).toBe('ACTIVE');
    });

    it('should deactivate variant', async () => {
      const created = await service.create('tenant-1', 'product-1', new CreateVariantCommand('tenant-1', 'product-1', 'SKU-001'));
      const result = await service.changeStatus(created.id, 'tenant-1', new ChangeVariantStatusCommand('INACTIVE'));
      expect(result.status).toBe('INACTIVE');
    });
  });

  describe('setDefault', () => {
    it('should set variant as default and unset previous', async () => {
      const v1 = await service.create('tenant-1', 'product-1', new CreateVariantCommand('tenant-1', 'product-1', 'SKU-001', null, null, undefined, undefined, true));
      const v2 = await service.create('tenant-1', 'product-1', new CreateVariantCommand('tenant-1', 'product-1', 'SKU-002'));

      const result = await service.setDefault(v2.id, 'tenant-1', 'product-1');
      expect(result.isDefault).toBe(true);

      const updatedV1 = await service.findById(v1.id, 'tenant-1');
      expect(updatedV1.isDefault).toBe(false);
    });
  });

  describe('updateAttributes', () => {
    it('should update attributes', async () => {
      const created = await service.create('tenant-1', 'product-1', new CreateVariantCommand('tenant-1', 'product-1', 'SKU-001'));
      const result = await service.updateAttributes(created.id, 'tenant-1', [{ name: 'color', value: 'Negra' }]);
      expect(result.attributes).toHaveLength(1);
      expect(result.attributes[0].value).toBe('Negra');
    });

    it('should throw on duplicate attribute combination', async () => {
      const attrs = [{ name: 'color', value: 'Negra' }];
      await service.create('tenant-1', 'product-1', new CreateVariantCommand('tenant-1', 'product-1', 'SKU-001', null, null, undefined, attrs));
      const v2 = await service.create('tenant-1', 'product-1', new CreateVariantCommand('tenant-1', 'product-1', 'SKU-002'));
      await expect(service.updateAttributes(v2.id, 'tenant-1', attrs)).rejects.toThrow(VariantException);
    });
  });

  describe('archive / restore', () => {
    it('should archive variant', async () => {
      const created = await service.create('tenant-1', 'product-1', new CreateVariantCommand('tenant-1', 'product-1', 'SKU-001'));
      const result = await service.archive(created.id, 'tenant-1');
      expect(result.status).toBe('ARCHIVED');
    });

    it('should restore archived variant', async () => {
      const created = await service.create('tenant-1', 'product-1', new CreateVariantCommand('tenant-1', 'product-1', 'SKU-001'));
      await service.archive(created.id, 'tenant-1');
      const result = await service.restore(created.id, 'tenant-1');
      expect(result.status).toBe('ACTIVE');
    });
  });

  describe('softDelete', () => {
    it('should soft delete variant', async () => {
      const created = await service.create('tenant-1', 'product-1', new CreateVariantCommand('tenant-1', 'product-1', 'SKU-001'));
      await service.softDelete(created.id, 'tenant-1');
      const deleted = await service.findById(created.id, 'tenant-1');
      expect(deleted.deletedAt).not.toBeNull();
    });
  });
});
