import type { OrderStatusHistoryResponseDto } from './order-response.dto';

export type OrderHistoryResponseDto = {
  orderId: string;
  history: OrderStatusHistoryResponseDto[];
};
