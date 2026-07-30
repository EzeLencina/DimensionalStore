import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { Warehouse, WarehouseId, InventoryException, INVENTORY_ERROR_CODES } from '../domain';
import { WAREHOUSE_REPOSITORY } from '../domain/repository';
import type { WarehouseRepository } from '../domain/repository';
import { InventoryMapper } from '../application/mappers';
import type { WarehouseResponseDto } from '../application/dto';
import { CreateWarehouseCommand } from '../application/commands';

@Injectable()
export class WarehouseAppService {
  constructor(
    @Inject(WAREHOUSE_REPOSITORY) private readonly warehouseRepo: WarehouseRepository,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async create(tenantId: string, command: CreateWarehouseCommand): Promise<WarehouseResponseDto> {
    const exists = await this.warehouseRepo.existsByCode(command.code, tenantId);
    if (exists) throw new InventoryException(INVENTORY_ERROR_CODES.WAREHOUSE_CODE_ALREADY_EXISTS, `Code "${command.code}" already exists`);

    const isDefault = command.isDefault ?? false;
    if (isDefault) {
      const existingDefault = await this.warehouseRepo.findDefault(tenantId);
      if (existingDefault) { existingDefault.unsetDefault(); await this.warehouseRepo.save(existingDefault); }
    }

    const warehouse = Warehouse.create({
      tenantId, name: command.name, code: command.code,
      address: command.address ?? null, status: command.status ?? 'ACTIVE', isDefault,
    });
    await this.warehouseRepo.save(warehouse);
    this.logger.info({ event: 'inventory.warehouse.created', warehouseId: warehouse.getId().toString(), tenantId }, 'Warehouse created');
    return InventoryMapper.warehouseToResponse(warehouse);
  }

  async list(tenantId: string): Promise<WarehouseResponseDto[]> {
    const warehouses = await this.warehouseRepo.list(tenantId);
    return warehouses.map(InventoryMapper.warehouseToResponse);
  }

  async findById(id: string, tenantId: string): Promise<WarehouseResponseDto> {
    const warehouse = await this.warehouseRepo.findById(new WarehouseId(id), tenantId);
    if (!warehouse) throw new InventoryException(INVENTORY_ERROR_CODES.WAREHOUSE_NOT_FOUND, 'Warehouse not found');
    return InventoryMapper.warehouseToResponse(warehouse);
  }

  async setDefault(id: string, tenantId: string): Promise<WarehouseResponseDto> {
    const warehouse = await this.warehouseRepo.findById(new WarehouseId(id), tenantId);
    if (!warehouse) throw new InventoryException(INVENTORY_ERROR_CODES.WAREHOUSE_NOT_FOUND, 'Warehouse not found');

    const existingDefault = await this.warehouseRepo.findDefault(tenantId);
    if (existingDefault && existingDefault.getId().toString() !== id) {
      existingDefault.unsetDefault();
      await this.warehouseRepo.save(existingDefault);
    }

    warehouse.setAsDefault();
    await this.warehouseRepo.save(warehouse);
    this.logger.info({ event: 'inventory.warehouse.set_default', warehouseId: id, tenantId }, 'Warehouse set as default');
    return InventoryMapper.warehouseToResponse(warehouse);
  }
}
