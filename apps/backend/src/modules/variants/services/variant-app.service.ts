import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import {
  ProductVariant, VariantId,
  VariantException, VARIANT_ERROR_CODES,
} from '../domain';
import { VARIANT_REPOSITORY } from '../domain/repository';
import type { VariantRepository } from '../domain/repository';
import { VariantValidator } from '../application/validators';
import { VariantMapper } from '../application/mappers';
import type {
  VariantResponseDto, PaginatedVariantResponseDto, VariantListQueryDto,
} from '../application/dto';
import {
  CreateVariantCommand,
  UpdateVariantCommand,
  ChangeVariantSkuCommand,
  ChangeVariantStatusCommand,
} from '../application/commands';

@Injectable()
export class VariantAppService {
  constructor(
    @Inject(VARIANT_REPOSITORY) private readonly repository: VariantRepository,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async create(tenantId: string, productId: string, command: CreateVariantCommand): Promise<VariantResponseDto> {
    const errors = VariantValidator.validateCreate(command);
    if (errors.length > 0) {
      throw new VariantException(VARIANT_ERROR_CODES.VARIANT_INVALID_DATA, errors.join('; '));
    }

    const skuExists = await this.repository.existsBySku(command.sku, tenantId);
    if (skuExists) {
      throw new VariantException(
        VARIANT_ERROR_CODES.VARIANT_SKU_ALREADY_EXISTS,
        `SKU "${command.sku}" already exists in this tenant`,
      );
    }

    if (command.attributes && command.attributes.length > 0) {
      const comboExists = await this.repository.existsAttributeCombination(
        productId, tenantId, command.attributes,
      );
      if (comboExists) {
        throw new VariantException(
          VARIANT_ERROR_CODES.VARIANT_ATTRIBUTE_COMBINATION_EXISTS,
          'This attribute combination already exists for this product',
        );
      }
    }

    const isDefault = command.isDefault ?? false;

    if (isDefault) {
      const existingDefault = await this.repository.findDefaultByProduct(productId, tenantId);
      if (existingDefault) {
        existingDefault.unsetDefault();
        await this.repository.save(existingDefault);
      }
    }

    const status = command.status ?? 'ACTIVE';
    const variant = ProductVariant.create({
      tenantId,
      productId,
      sku: command.sku,
      name: command.name ?? null,
      barcode: command.barcode ?? null,
      status: status as any,
      attributes: command.attributes ?? [],
      isDefault,
    });

    await this.repository.save(variant);

    this.logger.info(
      { event: 'variants.variant.created', variantId: variant.getId().toString(), tenantId, sku: command.sku },
      'Variant created',
    );

    return VariantMapper.toResponse(variant);
  }

  async findById(id: string, tenantId: string): Promise<VariantResponseDto> {
    const variantId = new VariantId(id);
    const variant = await this.repository.findById(variantId, tenantId);
    if (!variant) {
      throw new VariantException(VARIANT_ERROR_CODES.VARIANT_NOT_FOUND, 'Variant not found');
    }
    return VariantMapper.toResponse(variant);
  }

  async findBySku(sku: string, tenantId: string): Promise<VariantResponseDto> {
    const variant = await this.repository.findBySku(sku, tenantId);
    if (!variant) {
      throw new VariantException(VARIANT_ERROR_CODES.VARIANT_NOT_FOUND, 'Variant not found');
    }
    return VariantMapper.toResponse(variant);
  }

  async listByProduct(
    productId: string,
    tenantId: string,
    query: VariantListQueryDto,
  ): Promise<PaginatedVariantResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    if (query.status || query.search || query.includeDeleted) {
      const result = await this.repository.findFiltered(
        { tenantId, productId, status: query.status, search: query.search, includeDeleted: query.includeDeleted },
        query.sortField
          ? { field: query.sortField as any, direction: (query.sortDirection as any) ?? 'asc' }
          : undefined,
        page, limit,
      );
      return VariantMapper.toResponseList(result.data, result.total, page, limit);
    }

    const variants = await this.repository.listByProduct(productId, tenantId);
    const total = variants.length;
    const start = (page - 1) * limit;
    const data = variants.slice(start, start + limit);
    return VariantMapper.toResponseList(data, total, page, limit);
  }

  async update(id: string, tenantId: string, command: UpdateVariantCommand): Promise<VariantResponseDto> {
    const errors = VariantValidator.validateUpdate(command);
    if (errors.length > 0) {
      throw new VariantException(VARIANT_ERROR_CODES.VARIANT_INVALID_DATA, errors.join('; '));
    }

    const variantId = new VariantId(id);
    const variant = await this.repository.findById(variantId, tenantId);
    if (!variant) {
      throw new VariantException(VARIANT_ERROR_CODES.VARIANT_NOT_FOUND, 'Variant not found');
    }

    if (command.name !== undefined) variant.rename(command.name);
    if (command.barcode !== undefined) variant.changeBarcode(command.barcode);

    await this.repository.save(variant);
    return VariantMapper.toResponse(variant);
  }

  async changeSku(id: string, tenantId: string, command: ChangeVariantSkuCommand): Promise<VariantResponseDto> {
    const errors = VariantValidator.validateSkuChange(command);
    if (errors.length > 0) {
      throw new VariantException(VARIANT_ERROR_CODES.VARIANT_INVALID_SKU, errors.join('; '));
    }

    const variantId = new VariantId(id);
    const variant = await this.repository.findById(variantId, tenantId);
    if (!variant) {
      throw new VariantException(VARIANT_ERROR_CODES.VARIANT_NOT_FOUND, 'Variant not found');
    }

    const skuExists = await this.repository.existsBySku(command.sku, tenantId, id);
    if (skuExists) {
      throw new VariantException(
        VARIANT_ERROR_CODES.VARIANT_SKU_ALREADY_EXISTS,
        `SKU "${command.sku}" already exists in this tenant`,
      );
    }

    variant.changeSku(command.sku);
    await this.repository.save(variant);
    return VariantMapper.toResponse(variant);
  }

  async changeStatus(id: string, tenantId: string, command: ChangeVariantStatusCommand): Promise<VariantResponseDto> {
    const variantId = new VariantId(id);
    const variant = await this.repository.findById(variantId, tenantId);
    if (!variant) {
      throw new VariantException(VARIANT_ERROR_CODES.VARIANT_NOT_FOUND, 'Variant not found');
    }

    switch (command.status) {
      case 'ACTIVE':
        variant.activate();
        break;
      case 'INACTIVE':
        variant.deactivate();
        break;
      default:
        throw new VariantException(
          VARIANT_ERROR_CODES.VARIANT_INVALID_STATUS_TRANSITION,
          `Invalid status transition to ${command.status}`,
        );
    }

    await this.repository.save(variant);
    return VariantMapper.toResponse(variant);
  }

  async setDefault(id: string, tenantId: string, productId: string): Promise<VariantResponseDto> {
    const variantId = new VariantId(id);
    const variant = await this.repository.findById(variantId, tenantId);
    if (!variant) {
      throw new VariantException(VARIANT_ERROR_CODES.VARIANT_NOT_FOUND, 'Variant not found');
    }

    const existingDefault = await this.repository.findDefaultByProduct(productId, tenantId);
    if (existingDefault && existingDefault.getId().toString() !== id) {
      existingDefault.unsetDefault();
      await this.repository.save(existingDefault);
    }

    variant.setAsDefault();
    await this.repository.save(variant);

    this.logger.info(
      { event: 'variants.variant.set_default', variantId: id, tenantId, productId },
      'Variant set as default',
    );

    return VariantMapper.toResponse(variant);
  }

  async updateAttributes(
    id: string, tenantId: string,
    attributes: { name: string; value: string }[],
  ): Promise<VariantResponseDto> {
    const variantId = new VariantId(id);
    const variant = await this.repository.findById(variantId, tenantId);
    if (!variant) {
      throw new VariantException(VARIANT_ERROR_CODES.VARIANT_NOT_FOUND, 'Variant not found');
    }

    if (attributes.length > 0) {
      const comboExists = await this.repository.existsAttributeCombination(
        variant.getProductId(), tenantId, attributes, id,
      );
      if (comboExists) {
        throw new VariantException(
          VARIANT_ERROR_CODES.VARIANT_ATTRIBUTE_COMBINATION_EXISTS,
          'This attribute combination already exists for this product',
        );
      }
    }

    variant.updateAttributes(attributes);
    await this.repository.save(variant);
    return VariantMapper.toResponse(variant);
  }

  async archive(id: string, tenantId: string): Promise<VariantResponseDto> {
    const variantId = new VariantId(id);
    const variant = await this.repository.findById(variantId, tenantId);
    if (!variant) {
      throw new VariantException(VARIANT_ERROR_CODES.VARIANT_NOT_FOUND, 'Variant not found');
    }

    variant.archive();
    await this.repository.save(variant);

    this.logger.info(
      { event: 'variants.variant.archived', variantId: id, tenantId },
      'Variant archived',
    );

    return VariantMapper.toResponse(variant);
  }

  async restore(id: string, tenantId: string): Promise<VariantResponseDto> {
    const variantId = new VariantId(id);
    const variant = await this.repository.findById(variantId, tenantId);
    if (!variant) {
      throw new VariantException(VARIANT_ERROR_CODES.VARIANT_NOT_FOUND, 'Variant not found');
    }

    variant.restore();
    await this.repository.save(variant);
    return VariantMapper.toResponse(variant);
  }

  async softDelete(id: string, tenantId: string): Promise<void> {
    const variantId = new VariantId(id);
    const variant = await this.repository.findById(variantId, tenantId);
    if (!variant) {
      throw new VariantException(VARIANT_ERROR_CODES.VARIANT_NOT_FOUND, 'Variant not found');
    }

    variant.softDelete();
    await this.repository.save(variant);

    this.logger.info(
      { event: 'variants.variant.deleted', variantId: id, tenantId },
      'Variant soft deleted',
    );
  }
}
