jest.mock('@tienda/logger/nest', () => ({
  LOGGER_TOKEN: 'ILogger',
}));

import { CollectionAppService } from '../collection-app.service';
import { InMemoryCollectionRepository } from '../../infrastructure/persistence/in-memory/in-memory-collection.repository';
import { CatalogException } from '../../domain/exceptions';
import { CreateCollectionCommand, UpdateCollectionCommand } from '../../application/commands/collection';

describe('CollectionAppService', () => {
  let service: CollectionAppService;
  let repository: InMemoryCollectionRepository;

  beforeEach(() => {
    repository = new InMemoryCollectionRepository();
    const logger = { info: jest.fn(), debug: jest.fn(), warn: jest.fn(), error: jest.fn() };
    service = new CollectionAppService(repository as any, logger as any);
  });

  describe('create', () => {
    it('should create a collection', async () => {
      const command = new CreateCollectionCommand('tenant-1', 'Summer Sale', 'summer-sale');
      const result = await service.create('tenant-1', command);

      expect(result.id).toBeDefined();
      expect(result.name).toBe('Summer Sale');
      expect(result.slug).toBe('summer-sale');
      expect(result.status).toBe('DRAFT');
      expect(result.type).toBe('MANUAL');
      expect(result.tenantId).toBe('tenant-1');
    });

    it('should auto-generate slug from name', async () => {
      const command = new CreateCollectionCommand('tenant-1', 'Summer Sale!', '');
      const result = await service.create('tenant-1', command);
      expect(result.slug).toBe('summer-sale');
    });

    it('should create with dates', async () => {
      const command = new CreateCollectionCommand(
        'tenant-1', 'Summer Sale', 'summer-sale',
        null, undefined, undefined, undefined, undefined,
        '2024-06-01T00:00:00.000Z', '2024-08-31T00:00:00.000Z',
      );
      const result = await service.create('tenant-1', command);
      expect(result.startAt).toBe('2024-06-01T00:00:00.000Z');
      expect(result.endAt).toBe('2024-08-31T00:00:00.000Z');
    });

    it('should throw on duplicate slug', async () => {
      const command = new CreateCollectionCommand('tenant-1', 'Summer Sale', 'summer-sale');
      await service.create('tenant-1', command);

      const command2 = new CreateCollectionCommand('tenant-1', 'Summer Sale 2', 'summer-sale');
      await expect(service.create('tenant-1', command2)).rejects.toThrow(CatalogException);
    });

    it('should throw on invalid data', async () => {
      const command = new CreateCollectionCommand('tenant-1', '', '');
      await expect(service.create('tenant-1', command)).rejects.toThrow(CatalogException);
    });
  });

  describe('findById', () => {
    it('should find a collection by id', async () => {
      const created = await service.create('tenant-1', new CreateCollectionCommand('tenant-1', 'Summer Sale', 'summer-sale'));
      const found = await service.findById(created.id, 'tenant-1');
      expect(found.id).toBe(created.id);
    });

    it('should throw on not found', async () => {
      await expect(service.findById('non-existent', 'tenant-1')).rejects.toThrow(CatalogException);
    });

    it('should throw on tenant mismatch', async () => {
      const created = await service.create('tenant-1', new CreateCollectionCommand('tenant-1', 'Summer Sale', 'summer-sale'));
      await expect(service.findById(created.id, 'tenant-2')).rejects.toThrow(CatalogException);
    });
  });

  describe('findBySlug', () => {
    it('should find by slug', async () => {
      await service.create('tenant-1', new CreateCollectionCommand('tenant-1', 'Summer Sale', 'summer-sale'));
      const found = await service.findBySlug('summer-sale', 'tenant-1');
      expect(found.slug).toBe('summer-sale');
    });

    it('should throw on not found', async () => {
      await expect(service.findBySlug('non-existent', 'tenant-1')).rejects.toThrow(CatalogException);
    });
  });

  describe('update', () => {
    it('should update collection name', async () => {
      const created = await service.create('tenant-1', new CreateCollectionCommand('tenant-1', 'Summer Sale', 'summer-sale'));
      const updated = await service.update(created.id, 'tenant-1', new UpdateCollectionCommand(created.id, 'tenant-1', 'Winter Sale'));
      expect(updated.name).toBe('Winter Sale');
    });

    it('should throw on not found', async () => {
      await expect(
        service.update('non-existent', 'tenant-1', new UpdateCollectionCommand('non-existent', 'tenant-1', 'New Name')),
      ).rejects.toThrow(CatalogException);
    });
  });

  describe('status changes', () => {
    it('should activate a collection', async () => {
      const created = await service.create('tenant-1', new CreateCollectionCommand('tenant-1', 'Summer Sale', 'summer-sale'));
      const activated = await service.changeStatus(created.id, 'tenant-1', 'ACTIVE');
      expect(activated.status).toBe('ACTIVE');
    });

    it('should archive and restore', async () => {
      const created = await service.create('tenant-1', new CreateCollectionCommand('tenant-1', 'Summer Sale', 'summer-sale'));
      await service.changeStatus(created.id, 'tenant-1', 'ACTIVE');
      await service.archive(created.id, 'tenant-1');
      const restored = await service.restore(created.id, 'tenant-1');
      expect(restored.status).toBe('DRAFT');
    });
  });

  describe('visibility changes', () => {
    it('should change visibility', async () => {
      const created = await service.create('tenant-1', new CreateCollectionCommand('tenant-1', 'Summer Sale', 'summer-sale'));
      const updated = await service.changeVisibility(created.id, 'tenant-1', 'HIDDEN');
      expect(updated.visibility).toBe('HIDDEN');
    });
  });

  describe('findAll', () => {
    it('should list collections', async () => {
      await service.create('tenant-1', new CreateCollectionCommand('tenant-1', 'Summer Sale', 'summer-sale'));
      await service.create('tenant-1', new CreateCollectionCommand('tenant-1', 'Winter Sale', 'winter-sale'));

      const result = await service.findAll('tenant-1', {});
      expect(result.data).toHaveLength(2);
    });

    it('should paginate', async () => {
      for (let i = 0; i < 5; i++) {
        await service.create('tenant-1', new CreateCollectionCommand('tenant-1', `Collection ${i}`, `col-${i}`));
      }

      const result = await service.findAll('tenant-1', { page: 1, limit: 2 });
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(5);
    });
  });

  describe('softDelete', () => {
    it('should soft delete', async () => {
      const created = await service.create('tenant-1', new CreateCollectionCommand('tenant-1', 'Summer Sale', 'summer-sale'));
      await service.softDelete(created.id, 'tenant-1');
      const found = await service.findById(created.id, 'tenant-1');
      expect(found.deletedAt).not.toBeNull();
    });
  });
});
