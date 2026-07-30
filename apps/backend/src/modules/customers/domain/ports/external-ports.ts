export interface UserReader {
  exists(userId: string, tenantId: string): Promise<boolean>;
}

export interface OrderReader {
  countByCustomer(customerId: string, tenantId: string): Promise<number>;
  sumSpentByCustomer(customerId: string, tenantId: string): Promise<number>;
  findOrderTimestampsByCustomer(customerId: string, tenantId: string): Promise<{ firstOrderAt: Date | null; lastOrderAt: Date | null }>;
}

export interface EventPublisher { publish(event: unknown): Promise<void>; }
export interface Clock { now(): Date; }
export interface CurrentActor { getType(): string; getId(): string | null; }
