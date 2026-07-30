jest.mock('@tienda/logger/nest', () => ({
  LOGGER_TOKEN: 'ILogger',
}));

import { BrandAppService } from '../brand-app.service';
import { InMemoryBrandRepository } from '../../infrastructure/persistence/in-memory/in-memory-brand.repository';
import { BrandException } from '../../domain/exceptions';
import { CreateBrandCommand, UpdateBrandCommand } from '../../application/commands';

describe('BrandAppService', () => {
  let service: BrandAppService;
  let repository: InMemoryBrandRepository;

  beforeEach(() => {
    repository = new InMemoryBrandRepository();
    const logger = { info: jest.fn(), debug: jest.fn(), warn: jest.fn(), error: jest.fn() };
    service = new BrandAppService(repository as any, logger as any);
  });

  describe('create', () => {
    it('should create a brand', async () => {
      const command = new CreateBrandCommand('tenant-1', 'Nike', 'nike');
      const result = await service.create('tenant-1', command);

      expect(result.id).toBeDefined();
      expect(result.name).toBe('Nike');
      expect(result.slug).toBe('nike');
      expect(result.status).toBe('DRAFT');
      expect(result.tenantId).toBe('tenant-1');
    });

    it('should auto-generate slug from name', async () => {
      const command = new CreateBrandCommand('tenant-1', 'Home & Garden');
      const result = await service.create('tenant-1', command);

      expect(result.slug).toBe('home-garden');
    });

    it('should throw on duplicate slug', async () => {
      const command = new CreateBrandCommand('tenant-1', 'Nike', 'nike');
      await service.create('tenant-1', command);

      const command2 = new CreateBrandCommand('tenant-1', 'Nike Again', 'nike');
      await expect(service.create('tenant-1', command2)).rejects.toThrow(BrandException);
    });

    it('should throw on invalid data', async () => {
      const command = new CreateBrandCommand('tenant-1', '', '');
      await expect(service.create('tenant-1', command)).rejects.toThrow(BrandException);
    });
  });

  describe('findById', () => {
    it('should find a brand by id', async () => {
      const command = new CreateBrandCommand('tenant-1', 'Nike', 'nike');
      const created = await service.create('tenant-1', command);

      const found = await service.findById(created.id, 'tenant-1');
      expect(found.id).toBe(created.id);
      expect(found.name).toBe('Nike');
    });

    it('should throw on not found', async () => {
      await expect(service.findById('non-existent', 'tenant-1')).rejects.toThrow(BrandException);
    });

    it('should throw on tenant mismatch', async () => {
      const command = new CreateBrandCommand('tenant-1', 'Nike', 'nike');
      const created = await service.create('tenant-1', command);

      await expect(service.findById(created.id, 'tenant-2')).rejects.toThrow(BrandException);
    });
  });

  describe('findBySlug', () => {
    it('should find by slug', async () => {
      await service.create('tenant-1', new CreateBrandCommand('tenant-1', 'Nike', 'nike'));
      const found = await service.findBySlug('nike', 'tenant-1');
      expect(found.slug).toBe('nike');
    });

    it('should throw on not found', async () => {
      await expect(service.findBySlug('non-existent', 'tenant-1')).rejects.toThrow(BrandException);
    });
  });

  describe('findAll', () => {
    it('should return paginated brands', async () => {
      await service.create('tenant-1', new CreateBrandCommand('tenant-1', 'Nike', 'nike'));
      await service.create('tenant-1', new CreateBrandCommand('tenant-1', 'Adidas', 'adidas'));

      const result = await service.findAll('tenant-1', {});
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
    });

    it('should filter by status', async () => {
      await service.create('tenant-1', new CreateBrandCommand('tenant-1', 'Nike', 'nike'));
      const active = new CreateBrandCommand('tenant-1', 'Adidas', 'adidas', null, null, null, 'ACTIVE');
      await service.create('tenant-1', active);

      const result = await service.findAll('tenant-1', { status: 'ACTIVE' });
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Adidas');
    });
  });

  describe('update', () => {
    it('should update brand name', async () => {
      const created = await service.create('tenant-1', new CreateBrandCommand('tenant-1', 'Nike', 'nike'));
      const result = await service.update(created.id, 'tenant-1', new UpdateBrandCommand('Nike Updated'));

      expect(result.name).toBe('Nike Updated');
    });

    it('should update brand slug', async () => {
      const created = await service.create('tenant-1', new CreateBrandCommand('tenant-1', 'Nike', 'nike'));
      const result = await service.update(created.id, 'tenant-1', new UpdateBrandCommand(undefined, 'nike-sports'));

      expect(result.slug).toBe('nike-sports');
    });

    it('should throw on not found', async () => {
      await expect(
        service.update('non-existent', 'tenant-1', new UpdateBrandCommand('New Name')),
      ).rejects.toThrow(BrandException);
    });
  });

  describe('status management', () => {
    it('should activate brand', async () => {
      const created = await service.create('tenant-1', new CreateBrandCommand('tenant-1', 'Nike', 'nike'));
      const result = await service.changeStatus(created.id, 'tenant-1', 'ACTIVE');
      expect(result.status).toBe('ACTIVE');
    });

    it('should throw on invalid status', async () => {
      const created = await service.create('tenant-1', new CreateBrandCommand('tenant-1', 'Nike', 'nike'));
      await expect(service.changeStatus(created.id, 'tenant-1', 'INVALID')).rejects.toThrow(BrandException);
    });
  });

  describe('visibility management', () => {
    it('should change visibility', async () => {
      const created = await service.create('tenant-1', new CreateBrandCommand('tenant-1', 'Nike', 'nike'));
      const result = await service.changeVisibility(created.id, 'tenant-1', 'PRIVATE');
      expect(result.visibility).toBe('PRIVATE');
    });
  });

  describe('archive / restore', () => {
    it('should archive brand', async () => {
      const created = await service.create(
        'tenant-1',
        new CreateBrandCommand('tenant-1', 'Nike', 'nike', null, null, null, 'ACTIVE', 'PRIVATE'),
      );
      const result = await service.archive(created.id, 'tenant-1');
      expect(result.status).toBe('ARCHIVED');
    });

    it('should restore archived brand', async () => {
      const created = await service.create(
        'tenant-1',
        new CreateBrandCommand('tenant-1', 'Nike', 'nike', null, null, null, 'ACTIVE', 'PRIVATE'),
      );
      await service.archive(created.id, 'tenant-1');
      const result = await service.restore(created.id, 'tenant-1');
      expect(result.status).toBe('DRAFT');
    });
  });

  describe('softDelete', () => {
    it('should soft delete brand', async () => {
      const created = await service.create('tenant-1', new CreateBrandCommand('tenant-1', 'Nike', 'nike'));
      await service.softDelete(created.id, 'tenant-1');
      const deleted = await service.findById(created.id, 'tenant-1');
      expect(deleted.deletedAt).not.toBeNull();
    });
  });
});
