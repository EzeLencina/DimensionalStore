import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { Cart, CartId, CartException, CART_ERROR_CODES } from '../../../../domain';
import type { CartRepository } from '../../../../domain/repository';
import { PrismaCartMapper } from '../mappers/prisma-cart.mapper';

@Injectable()
export class PrismaCartRepository implements CartRepository {
  constructor(
    private readonly prisma: any,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  async findById(id: CartId, tenantId: string): Promise<Cart | null> {
    const model = await this.prisma.cart.findFirst({
      where: { id: id.getValue(), tenantId },
      include: { items: true },
    });
    return model ? PrismaCartMapper.toDomain(model) : null;
  }

  async findActiveByCustomer(customerId: string, tenantId: string): Promise<Cart | null> {
    const model = await this.prisma.cart.findFirst({
      where: { tenantId, customerId, status: 'ACTIVE' },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return model ? PrismaCartMapper.toDomain(model) : null;
  }

  async findActiveByGuestTokenHash(guestTokenHash: string, tenantId: string): Promise<Cart | null> {
    const model = await this.prisma.cart.findFirst({
      where: { tenantId, guestTokenHash, status: 'ACTIVE' },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    return model ? PrismaCartMapper.toDomain(model) : null;
  }

  async listExpired(tenantId: string, before: Date): Promise<Cart[]> {
    const models = await this.prisma.cart.findMany({
      where: { tenantId, status: 'ACTIVE', expiresAt: { lte: before } },
      include: { items: true },
    });
    return models.map(PrismaCartMapper.toDomain);
  }

  async save(cart: Cart): Promise<Cart> {
    const p = cart.toPrimitives();
    const existing = await this.prisma.cart.findUnique({ where: { id: p.id } });

    if (existing) {
      if (existing.version !== p.version) {
        throw new CartException(CART_ERROR_CODES.CART_VERSION_CONFLICT, 'Version conflict');
      }
      await this.prisma.$transaction(async (tx: any) => {
        await tx.cartItem.deleteMany({ where: { cartId: p.id } });
        await tx.cart.update({
          where: { id: p.id },
          data: {
            customerId: p.customerId, guestTokenHash: p.guestTokenHash,
            status: p.status, currency: p.currency,
            itemsCount: p.itemsCount, subtotal: p.subtotal, total: p.total,
            expiresAt: p.expiresAt, updatedAt: p.updatedAt, version: p.version,
            items: { create: p.items.map(item => ({
              id: item.id, productVariantId: item.productVariantId,
              sku: item.sku, quantity: item.quantity,
              unitPriceSnapshot: item.unitPriceSnapshot, subtotalSnapshot: item.subtotalSnapshot,
              addedAt: item.addedAt, updatedAt: item.updatedAt,
            }))},
          },
        });
      });
    } else {
      await this.prisma.cart.create({
        data: PrismaCartMapper.toCreateInput(cart),
      });
    }

    this.logger.debug({ event: 'cart.repository.saved', cartId: p.id, version: p.version }, 'Cart persisted');
    const saved = await this.findById(new CartId(p.id), p.tenantId);
    return saved!;
  }
}
