jest.mock('@tienda/logger/nest', () => ({ LOGGER_TOKEN: 'ILogger' }));

import { InventoryAppService } from '../inventory-app.service';
import { WarehouseAppService } from '../warehouse-app.service';
import { InMemoryInventoryRepository } from '../../infrastructure/persistence/in-memory/in-memory-inventory.repository';
import { InMemoryMovementRepository } from '../../infrastructure/persistence/in-memory/in-memory-movement.repository';
import { InMemoryReservationRepository } from '../../infrastructure/persistence/in-memory/in-memory-reservation.repository';
import { InMemoryWarehouseRepository } from '../../infrastructure/persistence/in-memory/in-memory-warehouse.repository';
import { InventoryException } from '../../domain/exceptions';
import {
  InitializeInventoryCommand, ReceiveStockCommand, DispatchStockCommand,
  AdjustStockCommand, ReserveStockCommand, TransferStockCommand,
  CreateWarehouseCommand, SetMinimumStockCommand,
} from '../../application/commands';

describe('InventoryAppService', () => {
  let invService: InventoryAppService;
  let whService: WarehouseAppService;
  let inventoryRepo: InMemoryInventoryRepository;
  let movementRepo: InMemoryMovementRepository;
  let reservationRepo: InMemoryReservationRepository;
  let warehouseRepo: InMemoryWarehouseRepository;
  const logger = { info: jest.fn(), debug: jest.fn(), warn: jest.fn(), error: jest.fn() };

  beforeEach(async () => {
    inventoryRepo = new InMemoryInventoryRepository();
    movementRepo = new InMemoryMovementRepository();
    reservationRepo = new InMemoryReservationRepository();
    warehouseRepo = new InMemoryWarehouseRepository();

    invService = new InventoryAppService(inventoryRepo as any, movementRepo as any, reservationRepo as any, logger as any);
    whService = new WarehouseAppService(warehouseRepo as any, logger as any);

    const wh = await whService.create('tenant-1', new CreateWarehouseCommand('tenant-1', 'Main Warehouse', 'MAIN', null, 'ACTIVE', true));
    const wh2 = await whService.create('tenant-1', new CreateWarehouseCommand('tenant-1', 'Secondary', 'SEC', null, 'ACTIVE', false));
    Object.assign(invService, { warehouseId: wh.id, wh2Id: wh2.id });
  });

  describe('initialize', () => {
    it('should initialize inventory item', async () => {
      const result = await invService.initialize('tenant-1', new InitializeInventoryCommand('tenant-1', 'pv-1', 'SKU-001', (invService as any).warehouseId));
      expect(result.sku).toBe('SKU-001');
      expect(result.onHand).toBe(0);
    });

    it('should initialize with quantity', async () => {
      const result = await invService.initialize('tenant-1', new InitializeInventoryCommand('tenant-1', 'pv-1', 'SKU-001', (invService as any).warehouseId, 100));
      expect(result.onHand).toBe(100);
    });

    it('should throw on duplicate', async () => {
      await invService.initialize('tenant-1', new InitializeInventoryCommand('tenant-1', 'pv-1', 'SKU-001', (invService as any).warehouseId));
      await expect(invService.initialize('tenant-1', new InitializeInventoryCommand('tenant-1', 'pv-1', 'SKU-001', (invService as any).warehouseId))).rejects.toThrow(InventoryException);
    });
  });

  describe('receive / dispatch', () => {
    beforeEach(async () => {
      await invService.initialize('tenant-1', new InitializeInventoryCommand('tenant-1', 'pv-1', 'SKU-001', (invService as any).warehouseId, 50));
    });

    it('should receive stock', async () => {
      const result = await invService.receiveStock('tenant-1', new ReceiveStockCommand('tenant-1', 'SKU-001', (invService as any).warehouseId, 30, 'Supplier delivery', 'user'));
      expect(result.onHand).toBe(80);
    });

    it('should dispatch stock', async () => {
      const result = await invService.dispatchStock('tenant-1', new DispatchStockCommand('tenant-1', 'SKU-001', (invService as any).warehouseId, 20, 'Customer order', 'user'));
      expect(result.onHand).toBe(30);
    });

    it('should throw on insufficient stock', async () => {
      await expect(invService.dispatchStock('tenant-1', new DispatchStockCommand('tenant-1', 'SKU-001', (invService as any).warehouseId, 100, 'Test', 'user'))).rejects.toThrow(InventoryException);
    });
  });

  describe('adjust', () => {
    beforeEach(async () => {
      await invService.initialize('tenant-1', new InitializeInventoryCommand('tenant-1', 'pv-1', 'SKU-001', (invService as any).warehouseId, 50));
    });

    it('should adjust stock up', async () => {
      const result = await invService.adjustStock('tenant-1', new AdjustStockCommand('tenant-1', 'SKU-001', (invService as any).warehouseId, 80, 'Count correction', 'user'));
      expect(result.onHand).toBe(80);
    });

    it('should adjust stock down', async () => {
      const result = await invService.adjustStock('tenant-1', new AdjustStockCommand('tenant-1', 'SKU-001', (invService as any).warehouseId, 30, 'Damaged goods', 'user'));
      expect(result.onHand).toBe(30);
    });
  });

  describe('reserve / release / consume', () => {
    beforeEach(async () => {
      await invService.initialize('tenant-1', new InitializeInventoryCommand('tenant-1', 'pv-1', 'SKU-001', (invService as any).warehouseId, 50));
    });

    it('should reserve stock', async () => {
      const result = await invService.reserveStock('tenant-1', new ReserveStockCommand('tenant-1', 'SKU-001', (invService as any).warehouseId, 10, 'order', 'order-123'));
      expect(result.status).toBe('ACTIVE');
      expect(result.quantity).toBe(10);
    });

    it('should throw on duplicate reservation reference', async () => {
      await invService.reserveStock('tenant-1', new ReserveStockCommand('tenant-1', 'SKU-001', (invService as any).warehouseId, 10, 'order', 'order-123'));
      await expect(invService.reserveStock('tenant-1', new ReserveStockCommand('tenant-1', 'SKU-001', (invService as any).warehouseId, 5, 'order', 'order-123'))).rejects.toThrow(InventoryException);
    });

    it('should release reservation', async () => {
      const reserved = await invService.reserveStock('tenant-1', new ReserveStockCommand('tenant-1', 'SKU-001', (invService as any).warehouseId, 10, 'order', 'order-123'));
      const result = await invService.releaseReservation(reserved.id, 'tenant-1');
      expect(result.status).toBe('RELEASED');
    });

    it('should consume reservation', async () => {
      const reserved = await invService.reserveStock('tenant-1', new ReserveStockCommand('tenant-1', 'SKU-001', (invService as any).warehouseId, 10, 'order', 'order-123'));
      const result = await invService.consumeReservation(reserved.id, 'tenant-1');
      expect(result.status).toBe('CONSUMED');

      const items = await invService.findBySku('SKU-001', 'tenant-1');
      expect(items[0].onHand).toBe(40);
    });
  });

  describe('transfer', () => {
    beforeEach(async () => {
      await invService.initialize('tenant-1', new InitializeInventoryCommand('tenant-1', 'pv-1', 'SKU-001', (invService as any).warehouseId, 50));
      await invService.initialize('tenant-1', new InitializeInventoryCommand('tenant-1', 'pv-1', 'SKU-001', (invService as any).wh2Id, 20));
    });

    it('should transfer stock between warehouses', async () => {
      await invService.transferStock('tenant-1', new TransferStockCommand('tenant-1', 'SKU-001', (invService as any).warehouseId, (invService as any).wh2Id, 20, 'Replenishment', 'user'));

      const items = await invService.findBySku('SKU-001', 'tenant-1');
      const fromItem = items.find(i => i.warehouseId === (invService as any).warehouseId)!;
      const toItem = items.find(i => i.warehouseId === (invService as any).wh2Id)!;
      expect(fromItem.onHand).toBe(30);
      expect(toItem.onHand).toBe(40);
    });
  });

  describe('setMinimumStock', () => {
    beforeEach(async () => {
      await invService.initialize('tenant-1', new InitializeInventoryCommand('tenant-1', 'pv-1', 'SKU-001', (invService as any).warehouseId, 10));
    });

    it('should set minimum stock', async () => {
      const result = await invService.setMinimumStock('tenant-1', new SetMinimumStockCommand('tenant-1', 'SKU-001', (invService as any).warehouseId, 15));
      expect(result.minimumStock).toBe(15);
    });
  });

  describe('cross-tenant isolation', () => {
    it('should not find items from other tenant', async () => {
      await invService.initialize('tenant-1', new InitializeInventoryCommand('tenant-1', 'pv-1', 'SKU-001', (invService as any).warehouseId, 10));
      const items = await invService.findBySku('SKU-001', 'tenant-2');
      expect(items).toHaveLength(0);
    });
  });
});
