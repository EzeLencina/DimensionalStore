import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { CheckoutSession, CheckoutId, CheckoutException, CHECKOUT_ERROR_CODES } from '../../../../domain';
import type { CheckoutRepository } from '../../../../domain/repository';
import { PrismaCheckoutMapper } from '../mappers/prisma-checkout.mapper';

@Injectable()
export class PrismaCheckoutSessionRepository implements CheckoutRepository {
  constructor(private readonly prisma: any, @Inject(LOGGER_TOKEN) private readonly logger: any) {}

  async findById(id: CheckoutId, tenantId: string): Promise<CheckoutSession | null> {
    const model = await this.prisma.checkoutSession.findFirst({
      where: { id: id.getValue(), tenantId },
      include: { address: true },
    });
    return model ? PrismaCheckoutMapper.toDomain(model) : null;
  }

  async findActiveByCart(cartId: string, tenantId: string): Promise<CheckoutSession | null> {
    const model = await this.prisma.checkoutSession.findFirst({
      where: { tenantId, cartId, status: { in: ['OPEN', 'VALIDATING', 'READY'] } },
      include: { address: true },
      orderBy: { createdAt: 'desc' },
    });
    return model ? PrismaCheckoutMapper.toDomain(model) : null;
  }

  async findByIdempotencyKey(key: string, tenantId: string): Promise<CheckoutSession | null> {
    const model = await this.prisma.checkoutSession.findFirst({
      where: { tenantId, idempotencyKey: key },
      include: { address: true, order: { include: { items: true } } },
    });
    return model ? PrismaCheckoutMapper.toDomain(model) : null;
  }

  async listExpired(tenantId: string, before: Date): Promise<CheckoutSession[]> {
    const models = await this.prisma.checkoutSession.findMany({
      where: { tenantId, status: { in: ['OPEN', 'VALIDATING', 'READY'] }, expiresAt: { lte: before } },
      include: { address: true },
    });
    return models.map(PrismaCheckoutMapper.toDomain);
  }

  async save(cs: CheckoutSession): Promise<CheckoutSession> {
    const p = cs.toPrimitives();
    const existing = await this.prisma.checkoutSession.findUnique({ where: { id: p.id } });

    if (existing) {
      if (existing.version !== p.version) throw new CheckoutException(CHECKOUT_ERROR_CODES.CHECKOUT_VERSION_CONFLICT, 'Version conflict');
      const { address, ...data } = p;
      await this.prisma.$transaction(async (tx: any) => {
        await tx.checkoutAddress.deleteMany({ where: { checkoutSessionId: p.id } });
        await tx.checkoutSession.update({
          where: { id: p.id },
          data: {
            ...data, updatedAt: new Date(), version: p.version,
            address: address ? { create: address } : undefined,
          },
        });
      });
    } else {
      await this.prisma.checkoutSession.create({ data: PrismaCheckoutMapper.toCreateInput(cs) });
    }

    this.logger.debug({ event: 'checkout.repository.saved', checkoutId: p.id }, 'CheckoutSession persisted');
    const saved = await this.findById(new CheckoutId(p.id), p.tenantId);
    return saved!;
  }
}
