jest.mock('@tienda/logger/nest', () => ({
  LOGGER_TOKEN: 'ILogger',
}));

import { CategoryAppService } from '../category-app.service';
import { InMemoryCategoryRepository } from '../../infrastructure/persistence/in-memory/in-memory-category.repository';
import { CatalogException } from '../../domain/exceptions';
import { CreateCategoryCommand, UpdateCategoryCommand } from '../../application/commands/category';

describe('CategoryAppService', () => {
  let service: CategoryAppService;
  let repository: InMemoryCategoryRepository;

  beforeEach(() => {
    repository = new InMemoryCategoryRepository();
    const logger = { info: jest.fn(), debug: jest.fn(), warn: jest.fn(), error: jest.fn() };
    service = new CategoryAppService(repository as any, logger as any);
  });

  describe('create', () => {
    it('should create a category', async () => {
      const command = new CreateCategoryCommand('tenant-1', 'Electronics', 'electronics');
      const result = await service.create('tenant-1', command);

      expect(result.id).toBeDefined();
      expect(result.name).toBe('Electronics');
      expect(result.slug).toBe('electronics');
      expect(result.status).toBe('DRAFT');
      expect(result.tenantId).toBe('tenant-1');
    });

    it('should auto-generate slug from name', async () => {
      const command = new CreateCategoryCommand('tenant-1', 'Home & Garden', '');
      const result = await service.create('tenant-1', command);

      expect(result.slug).toBe('home-garden');
    });

    it('should throw on duplicate slug', async () => {
      const command = new CreateCategoryCommand('tenant-1', 'Electronics', 'electronics');
      await service.create('tenant-1', command);

      const command2 = new CreateCategoryCommand('tenant-1', 'Electronics Again', 'electronics');
      await expect(service.create('tenant-1', command2)).rejects.toThrow(CatalogException);
    });

    it('should throw on invalid data', async () => {
      const command = new CreateCategoryCommand('tenant-1', '', '');
      await expect(service.create('tenant-1', command)).rejects.toThrow(CatalogException);
    });
  });

  describe('findById', () => {
    it('should find a category by id', async () => {
      const command = new CreateCategoryCommand('tenant-1', 'Electronics', 'electronics');
      const created = await service.create('tenant-1', command);

      const found = await service.findById(created.id, 'tenant-1');
      expect(found.id).toBe(created.id);
      expect(found.name).toBe('Electronics');
    });

    it('should throw on not found', async () => {
      await expect(service.findById('non-existent', 'tenant-1')).rejects.toThrow(CatalogException);
    });

    it('should throw on tenant mismatch', async () => {
      const command = new CreateCategoryCommand('tenant-1', 'Electronics', 'electronics');
      const created = await service.create('tenant-1', command);

      await expect(service.findById(created.id, 'tenant-2')).rejects.toThrow(CatalogException);
    });
  });

  describe('findBySlug', () => {
    it('should find by slug', async () => {
      await service.create('tenant-1', new CreateCategoryCommand('tenant-1', 'Electronics', 'electronics'));
      const found = await service.findBySlug('electronics', 'tenant-1');
      expect(found.slug).toBe('electronics');
    });

    it('should throw on not found', async () => {
      await expect(service.findBySlug('non-existent', 'tenant-1')).rejects.toThrow(CatalogException);
    });
  });

  describe('update', () => {
    it('should update category name', async () => {
      const created = await service.create('tenant-1', new CreateCategoryCommand('tenant-1', 'Electronics', 'electronics'));
      const updated = await service.update(created.id, 'tenant-1', new UpdateCategoryCommand(created.id, 'tenant-1', 'Home & Garden'));

      expect(updated.name).toBe('Home & Garden');
    });

    it('should throw on duplicate slug', async () => {
      await service.create('tenant-1', new CreateCategoryCommand('tenant-1', 'Electronics', 'electronics'));
      const created2 = await service.create('tenant-1', new CreateCategoryCommand('tenant-1', 'Books', 'books'));

      await expect(
        service.update(created2.id, 'tenant-1', new UpdateCategoryCommand(created2.id, 'tenant-1', undefined, 'electronics')),
      ).rejects.toThrow(CatalogException);
    });

    it('should throw on not found', async () => {
      await expect(
        service.update('non-existent', 'tenant-1', new UpdateCategoryCommand('non-existent', 'tenant-1', 'New Name')),
      ).rejects.toThrow(CatalogException);
    });
  });

  describe('status changes', () => {
    it('should activate a category', async () => {
      const created = await service.create('tenant-1', new CreateCategoryCommand('tenant-1', 'Electronics', 'electronics'));
      const activated = await service.changeStatus(created.id, 'tenant-1', 'ACTIVE');
      expect(activated.status).toBe('ACTIVE');
    });

    it('should archive a category', async () => {
      const created = await service.create('tenant-1', new CreateCategoryCommand('tenant-1', 'Electronics', 'electronics'));
      await service.changeStatus(created.id, 'tenant-1', 'ACTIVE');
      const archived = await service.changeStatus(created.id, 'tenant-1', 'ARCHIVED');
      expect(archived.status).toBe('ARCHIVED');
    });

    it('should restore a category', async () => {
      const created = await service.create('tenant-1', new CreateCategoryCommand('tenant-1', 'Electronics', 'electronics'));
      await service.changeStatus(created.id, 'tenant-1', 'ACTIVE');
      await service.archive(created.id, 'tenant-1');
      const restored = await service.restore(created.id, 'tenant-1');
      expect(restored.status).toBe('DRAFT');
    });
  });

  describe('visibility changes', () => {
    it('should change visibility', async () => {
      const created = await service.create('tenant-1', new CreateCategoryCommand('tenant-1', 'Electronics', 'electronics'));
      const updated = await service.changeVisibility(created.id, 'tenant-1', 'PRIVATE');
      expect(updated.visibility).toBe('PRIVATE');
    });
  });

  describe('findAll', () => {
    it('should list categories', async () => {
      await service.create('tenant-1', new CreateCategoryCommand('tenant-1', 'Electronics', 'electronics'));
      await service.create('tenant-1', new CreateCategoryCommand('tenant-1', 'Books', 'books'));

      const result = await service.findAll('tenant-1', {});
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should filter by status', async () => {
      await service.create('tenant-1', new CreateCategoryCommand('tenant-1', 'Electronics', 'electronics', undefined, undefined, undefined, 'ACTIVE'));
      await service.create('tenant-1', new CreateCategoryCommand('tenant-1', 'Books', 'books'));

      const result = await service.findAll('tenant-1', { status: 'DRAFT' });
      expect(result.data).toHaveLength(1);
    });

    it('should search by name', async () => {
      await service.create('tenant-1', new CreateCategoryCommand('tenant-1', 'Electronics', 'electronics'));
      await service.create('tenant-1', new CreateCategoryCommand('tenant-1', 'Books', 'books'));

      const result = await service.findAll('tenant-1', { search: 'electron' });
      expect(result.data).toHaveLength(1);
    });

    it('should paginate', async () => {
      for (let i = 0; i < 5; i++) {
        await service.create('tenant-1', new CreateCategoryCommand('tenant-1', `Category ${i}`, `cat-${i}`));
      }

      const result = await service.findAll('tenant-1', { page: 1, limit: 2 });
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(5);
      expect(result.totalPages).toBe(3);
    });
  });

  describe('softDelete', () => {
    it('should soft delete', async () => {
      const created = await service.create('tenant-1', new CreateCategoryCommand('tenant-1', 'Electronics', 'electronics'));
      await service.softDelete(created.id, 'tenant-1');

      const found = await service.findById(created.id, 'tenant-1');
      expect(found.deletedAt).not.toBeNull();
    });
  });
});
