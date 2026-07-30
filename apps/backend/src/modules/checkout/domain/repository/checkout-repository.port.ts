import type { CheckoutSession } from '../aggregates/checkout-session.aggregate';
import type { CheckoutId } from '../value-objects/checkout-id';

export const CHECKOUT_REPOSITORY = 'CHECKOUT_REPOSITORY';

export interface CheckoutRepository {
  save(cs: CheckoutSession): Promise<CheckoutSession>;
  findById(id: CheckoutId, tenantId: string): Promise<CheckoutSession | null>;
  findActiveByCart(cartId: string, tenantId: string): Promise<CheckoutSession | null>;
  findByIdempotencyKey(key: string, tenantId: string): Promise<CheckoutSession | null>;
  listExpired(tenantId: string, before: Date): Promise<CheckoutSession[]>;
}
