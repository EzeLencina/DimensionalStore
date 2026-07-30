export interface InventoryReservationService {
  releaseReservation(reference: string, tenantId: string): Promise<void>;
  releaseReservationsByReference(reference: string, tenantId: string): Promise<void>;
}

export interface PaymentStatusReader {
  getPaymentStatus(orderId: string, tenantId: string): Promise<string | null>;
}

export interface EventPublisher {
  publish(event: any): Promise<void>;
}

export interface Clock {
  now(): Date;
}

export interface CurrentActor {
  getType(): string;
  getId(): string | null;
}
