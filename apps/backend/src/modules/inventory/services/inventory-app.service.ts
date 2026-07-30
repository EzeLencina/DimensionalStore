import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import {
  InventoryItem, InventoryItemId, StockMovement, StockReservation,
  InventoryException, INVENTORY_ERROR_CODES, MovementId, ReservationId,
} from '../domain';
import { INVENTORY_REPOSITORY, STOCK_MOVEMENT_REPOSITORY, STOCK_RESERVATION_REPOSITORY } from '../domain/repository';
import type { InventoryRepository, StockMovementRepository, StockReservationRepository } from '../domain/repository';
import { InventoryValidator } from '../application/validators';
import { InventoryMapper } from '../application/mappers';
import type {
  InventoryItemResponseDto, StockMovementResponseDto,
  StockReservationResponseDto, PaginatedResponseDto,
} from '../application/dto';
import {
  InitializeInventoryCommand, ReceiveStockCommand, DispatchStockCommand,
  AdjustStockCommand, ReserveStockCommand, TransferStockCommand,
  SetMinimumStockCommand,
} from '../application/commands';

@Injectable()
export class InventoryAppService {
  constructor(
    @Inject(INVENTORY_REPOSITORY) private readonly inventoryRepo: InventoryRepository,
    @Inject(STOCK_MOVEMENT_REPOSITORY) private readonly movementRepo: StockMovementRepository,
    @Inject(STOCK_RESERVATION_REPOSITORY) private readonly reservationRepo: StockReservationRepository,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async initialize(tenantId: string, command: InitializeInventoryCommand): Promise<InventoryItemResponseDto> {
    const errors = InventoryValidator.validateInitialize(command);
    if (errors.length > 0) throw new InventoryException(INVENTORY_ERROR_CODES.INVENTORY_INVALID_DATA, errors.join('; '));

    const exists = await this.inventoryRepo.existsByVariantAndWarehouse(command.productVariantId, command.warehouseId, tenantId);
    if (exists) throw new InventoryException(INVENTORY_ERROR_CODES.INVENTORY_ALREADY_INITIALIZED, 'Inventory already exists for this variant and warehouse');

    const initialQty = command.quantity ?? 0;
    const item = InventoryItem.create(tenantId, command.warehouseId, command.productVariantId, command.sku, initialQty);
    await this.inventoryRepo.save(item);

    if (initialQty > 0) {
      await this.movementRepo.append(new StockMovement(
        new MovementId(), tenantId, command.warehouseId, command.productVariantId,
        'INITIAL', initialQty, 0, initialQty, 'Initial inventory', 'system',
      ));
    }

    this.logger.info({ event: 'inventory.item.initialized', sku: command.sku, warehouseId: command.warehouseId, tenantId, quantity: initialQty }, 'Inventory initialized');
    return InventoryMapper.inventoryToResponse(item);
  }

  async findBySku(sku: string, tenantId: string): Promise<InventoryItemResponseDto[]> {
    const items = await this.inventoryRepo.findBySkuAcrossWarehouses(sku, tenantId);
    return items.map(InventoryMapper.inventoryToResponse);
  }

  async listByWarehouse(warehouseId: string, tenantId: string): Promise<InventoryItemResponseDto[]> {
    const items = await this.inventoryRepo.listByWarehouse(warehouseId, tenantId);
    return items.map(InventoryMapper.inventoryToResponse);
  }

  async findLowStock(tenantId: string, threshold?: number): Promise<InventoryItemResponseDto[]> {
    const items = await this.inventoryRepo.findLowStock(tenantId, threshold);
    return items.map(InventoryMapper.inventoryToResponse);
  }

  async receiveStock(tenantId: string, command: ReceiveStockCommand): Promise<InventoryItemResponseDto> {
    const errors = InventoryValidator.validateReceive(command);
    if (errors.length > 0) throw new InventoryException(INVENTORY_ERROR_CODES.INVENTORY_INVALID_DATA, errors.join('; '));

    const item = await this.inventoryRepo.findBySkuAndWarehouse(command.sku, command.warehouseId, tenantId);
    if (!item) throw new InventoryException(INVENTORY_ERROR_CODES.INVENTORY_ITEM_NOT_FOUND, 'Inventory item not found');

    const prevOnHand = item.getOnHand();
    item.receive(command.quantity);
    await this.inventoryRepo.save(item);

    await this.movementRepo.append(new StockMovement(
      new MovementId(), tenantId, command.warehouseId, item.getProductVariantId(),
      'INBOUND', command.quantity, prevOnHand, item.getOnHand(),
      command.reason, command.createdBy, command.referenceType ?? null, command.referenceId ?? null,
    ));

    this.logger.info({ event: 'inventory.stock.received', sku: command.sku, quantity: command.quantity, warehouseId: command.warehouseId, tenantId }, 'Stock received');
    return InventoryMapper.inventoryToResponse(item);
  }

  async dispatchStock(tenantId: string, command: DispatchStockCommand): Promise<InventoryItemResponseDto> {
    const errors = InventoryValidator.validateDispatch(command);
    if (errors.length > 0) throw new InventoryException(INVENTORY_ERROR_CODES.INVENTORY_INVALID_DATA, errors.join('; '));

    const item = await this.inventoryRepo.findBySkuAndWarehouse(command.sku, command.warehouseId, tenantId);
    if (!item) throw new InventoryException(INVENTORY_ERROR_CODES.INVENTORY_ITEM_NOT_FOUND, 'Inventory item not found');

    const prevOnHand = item.getOnHand();
    item.dispatch(command.quantity);
    await this.inventoryRepo.save(item);

    await this.movementRepo.append(new StockMovement(
      new MovementId(), tenantId, command.warehouseId, item.getProductVariantId(),
      'OUTBOUND', command.quantity, prevOnHand, item.getOnHand(),
      command.reason, command.createdBy, command.referenceType ?? null, command.referenceId ?? null,
    ));

    this.logger.info({ event: 'inventory.stock.dispatched', sku: command.sku, quantity: command.quantity, warehouseId: command.warehouseId, tenantId }, 'Stock dispatched');
    return InventoryMapper.inventoryToResponse(item);
  }

  async adjustStock(tenantId: string, command: AdjustStockCommand): Promise<InventoryItemResponseDto> {
    const errors = InventoryValidator.validateAdjust(command);
    if (errors.length > 0) throw new InventoryException(INVENTORY_ERROR_CODES.INVENTORY_INVALID_DATA, errors.join('; '));

    const item = await this.inventoryRepo.findBySkuAndWarehouse(command.sku, command.warehouseId, tenantId);
    if (!item) throw new InventoryException(INVENTORY_ERROR_CODES.INVENTORY_ITEM_NOT_FOUND, 'Inventory item not found');

    const prevOnHand = item.getOnHand();
    const adjustmentType = command.newOnHand >= prevOnHand ? 'ADJUSTMENT_IN' : 'ADJUSTMENT_OUT';
    item.adjust(command.newOnHand);
    await this.inventoryRepo.save(item);

    const delta = Math.abs(command.newOnHand - prevOnHand);
    await this.movementRepo.append(new StockMovement(
      new MovementId(), tenantId, command.warehouseId, item.getProductVariantId(),
      adjustmentType as any, delta, prevOnHand, item.getOnHand(),
      command.reason, command.createdBy,
    ));

    this.logger.info({ event: 'inventory.stock.adjusted', sku: command.sku, warehouseId: command.warehouseId, prevOnHand, newOnHand: command.newOnHand, tenantId }, 'Stock adjusted');
    return InventoryMapper.inventoryToResponse(item);
  }

  async reserveStock(tenantId: string, command: ReserveStockCommand): Promise<StockReservationResponseDto> {
    const errors = InventoryValidator.validateReserve(command);
    if (errors.length > 0) throw new InventoryException(INVENTORY_ERROR_CODES.INVENTORY_INVALID_DATA, errors.join('; '));

    const item = await this.inventoryRepo.findBySkuAndWarehouse(command.sku, command.warehouseId, tenantId);
    if (!item) throw new InventoryException(INVENTORY_ERROR_CODES.INVENTORY_ITEM_NOT_FOUND, 'Inventory item not found');

    const existing = await this.reservationRepo.findByReference(command.referenceType, command.referenceId, item.getProductVariantId(), tenantId);
    if (existing) throw new InventoryException(INVENTORY_ERROR_CODES.RESERVATION_ALREADY_EXISTS, 'Reservation already exists for this reference');

    item.reserve(command.quantity);
    await this.inventoryRepo.save(item);

    const reservation = StockReservation.create({
      tenantId, warehouseId: command.warehouseId,
      productVariantId: item.getProductVariantId(),
      quantity: command.quantity, referenceType: command.referenceType,
      referenceId: command.referenceId, expiresAt: command.expiresAt ?? null,
    });
    await this.reservationRepo.save(reservation);

    await this.movementRepo.append(new StockMovement(
      new MovementId(), tenantId, command.warehouseId, item.getProductVariantId(),
      'RESERVATION', command.quantity, item.getOnHand() + command.quantity, item.getOnHand(),
      `Reserved for ${command.referenceType}:${command.referenceId}`,
      command.createdBy ?? 'system', command.referenceType, command.referenceId,
    ));

    this.logger.info({ event: 'inventory.stock.reserved', sku: command.sku, quantity: command.quantity, referenceType: command.referenceType, referenceId: command.referenceId, tenantId }, 'Stock reserved');
    return InventoryMapper.reservationToResponse(reservation);
  }

  async releaseReservation(id: string, tenantId: string): Promise<StockReservationResponseDto> {
    const reservation = await this.reservationRepo.findById(new ReservationId(id), tenantId);
    if (!reservation) throw new InventoryException(INVENTORY_ERROR_CODES.RESERVATION_NOT_FOUND, 'Reservation not found');
    if (!reservation.isActive()) throw new InventoryException(INVENTORY_ERROR_CODES.RESERVATION_INVALID_STATUS, `Cannot release reservation with status ${reservation.status}`);

    const item = await this.inventoryRepo.findByVariantAndWarehouse(reservation.productVariantId, reservation.warehouseId, tenantId);
    if (item) {
      const prevOnHand = item.getOnHand();
      item.releaseReservation(reservation.quantity);
      await this.inventoryRepo.save(item);

      await this.movementRepo.append(new StockMovement(
        new MovementId(), tenantId, reservation.warehouseId, reservation.productVariantId,
        'RELEASE', reservation.quantity, prevOnHand, item.getOnHand(),
        `Released reservation ${reservation.id.toString()}`,
        'system', 'reservation', reservation.id.toString(),
      ));
    }

    const released = reservation.release();
    await this.reservationRepo.save(released);

    this.logger.info({ event: 'inventory.reservation.released', reservationId: id, tenantId }, 'Reservation released');
    return InventoryMapper.reservationToResponse(released);
  }

  async consumeReservation(id: string, tenantId: string): Promise<StockReservationResponseDto> {
    const reservation = await this.reservationRepo.findById(new ReservationId(id), tenantId);
    if (!reservation) throw new InventoryException(INVENTORY_ERROR_CODES.RESERVATION_NOT_FOUND, 'Reservation not found');
    if (!reservation.isActive()) throw new InventoryException(INVENTORY_ERROR_CODES.RESERVATION_INVALID_STATUS, `Cannot consume reservation with status ${reservation.status}`);
    if (reservation.hasExpired()) throw new InventoryException(INVENTORY_ERROR_CODES.RESERVATION_EXPIRED, 'Reservation has expired');

    const item = await this.inventoryRepo.findByVariantAndWarehouse(reservation.productVariantId, reservation.warehouseId, tenantId);
    if (!item) throw new InventoryException(INVENTORY_ERROR_CODES.INVENTORY_ITEM_NOT_FOUND, 'Inventory item not found');

    const prevOnHand = item.getOnHand();
    item.consumeReservation(reservation.quantity);
    await this.inventoryRepo.save(item);

    await this.movementRepo.append(new StockMovement(
      new MovementId(), tenantId, reservation.warehouseId, reservation.productVariantId,
      'OUTBOUND', reservation.quantity, prevOnHand, item.getOnHand(),
      `Consumed reservation ${reservation.id.toString()}`,
      'system', 'reservation', reservation.id.toString(),
    ));

    const consumed = reservation.consume();
    await this.reservationRepo.save(consumed);

    this.logger.info({ event: 'inventory.reservation.consumed', reservationId: id, tenantId, quantity: reservation.quantity }, 'Reservation consumed');
    return InventoryMapper.reservationToResponse(consumed);
  }

  async transferStock(tenantId: string, command: TransferStockCommand): Promise<void> {
    const errors = InventoryValidator.validateTransfer(command);
    if (errors.length > 0) throw new InventoryException(INVENTORY_ERROR_CODES.INVENTORY_INVALID_DATA, errors.join('; '));

    const fromItem = await this.inventoryRepo.findBySkuAndWarehouse(command.sku, command.fromWarehouseId, tenantId);
    if (!fromItem) throw new InventoryException(INVENTORY_ERROR_CODES.INVENTORY_ITEM_NOT_FOUND, 'Source inventory item not found');

    const toItem = await this.inventoryRepo.findBySkuAndWarehouse(command.sku, command.toWarehouseId, tenantId);
    if (!toItem) throw new InventoryException(INVENTORY_ERROR_CODES.INVENTORY_ITEM_NOT_FOUND, 'Destination inventory item not found');

    const fromPrev = fromItem.getOnHand();
    const toPrev = toItem.getOnHand();

    fromItem.dispatch(command.quantity);
    toItem.receive(command.quantity);

    await this.inventoryRepo.save(fromItem);
    await this.inventoryRepo.save(toItem);

    const pvId = fromItem.getProductVariantId();

    await this.movementRepo.append(new StockMovement(
      new MovementId(), tenantId, command.fromWarehouseId, pvId,
      'TRANSFER_OUT', command.quantity, fromPrev, fromItem.getOnHand(),
      command.reason, command.createdBy, 'transfer', command.toWarehouseId,
    ));
    await this.movementRepo.append(new StockMovement(
      new MovementId(), tenantId, command.toWarehouseId, pvId,
      'TRANSFER_IN', command.quantity, toPrev, toItem.getOnHand(),
      command.reason, command.createdBy, 'transfer', command.fromWarehouseId,
    ));

    this.logger.info({ event: 'inventory.stock.transferred', sku: command.sku, fromWarehouseId: command.fromWarehouseId, toWarehouseId: command.toWarehouseId, quantity: command.quantity, tenantId }, 'Stock transferred');
  }

  async setMinimumStock(tenantId: string, command: SetMinimumStockCommand): Promise<InventoryItemResponseDto> {
    const item = await this.inventoryRepo.findBySkuAndWarehouse(command.sku, command.warehouseId, tenantId);
    if (!item) throw new InventoryException(INVENTORY_ERROR_CODES.INVENTORY_ITEM_NOT_FOUND, 'Inventory item not found');
    item.setMinimumStock(command.minimumStock);
    await this.inventoryRepo.save(item);
    return InventoryMapper.inventoryToResponse(item);
  }

  async listMovements(
    tenantId: string, productVariantId?: string, warehouseId?: string, page = 1, limit = 50,
  ): Promise<PaginatedResponseDto<StockMovementResponseDto>> {
    if (productVariantId) {
      const result = await this.movementRepo.listByVariant(productVariantId, tenantId, limit, (page - 1) * limit);
      return InventoryMapper.toPaginated(result.data.map(InventoryMapper.movementToResponse), result.total, page, limit);
    }
    if (warehouseId) {
      const result = await this.movementRepo.listByWarehouse(warehouseId, tenantId, limit, (page - 1) * limit);
      return InventoryMapper.toPaginated(result.data.map(InventoryMapper.movementToResponse), result.total, page, limit);
    }
    return InventoryMapper.toPaginated([], 0, page, limit);
  }
}
