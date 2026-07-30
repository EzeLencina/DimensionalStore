export const ORDER_PERMISSIONS = {
  READ: 'orders.read',
  READ_OWN: 'orders.read-own',
  UPDATE: 'orders.update',
  CONFIRM_PAYMENT: 'orders.confirm-payment',
  PROCESS: 'orders.process',
  SHIP: 'orders.ship',
  DELIVER: 'orders.deliver',
  CANCEL: 'orders.cancel',
  NOTES: 'orders.notes',
  MANAGE: 'orders.manage',
} as const;

export const DEFAULT_EXPIRATION_HOURS = 24;

export const CANCELLATION_REASON_CODES = [
  'CUSTOMER_REQUEST',
  'OUT_OF_STOCK',
  'PAYMENT_FAILED',
  'FRAUD_SUSPECTED',
  'DUPLICATE_ORDER',
  'ADMIN_DECISION',
  'OTHER',
] as const;
