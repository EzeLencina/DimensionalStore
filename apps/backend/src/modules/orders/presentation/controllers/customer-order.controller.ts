import { Controller, Get, Param, Headers, Query } from '@nestjs/common';
import { OrderAppService } from '../../services';
import type { OrderResponseDto, OrderListResponseDto } from '../../application/dto';

@Controller('api/v1/account/orders')
export class CustomerOrderController {
  constructor(private readonly orderService: OrderAppService) {}

  private getTenantId(headers: Record<string, string>): string {
    return headers['x-tenant-id'] || 'default';
  }

  private getCustomerId(headers: Record<string, string>): string {
    return headers['x-customer-id'] || headers['x-user-id'] || '';
  }

  @Get()
  async list(
    @Headers() headers: Record<string, string>,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<OrderListResponseDto> {
    const customerId = this.getCustomerId(headers);
    if (!customerId) return { items: [], total: 0, limit: 0, offset: 0 };
    return this.orderService.listCustomerOrders(customerId, this.getTenantId(headers), {
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
  }

  @Get(':id')
  async getById(@Headers() headers: Record<string, string>, @Param('id') id: string): Promise<OrderResponseDto> {
    return this.orderService.getCustomerOrderById(id, this.getCustomerId(headers), this.getTenantId(headers));
  }
}
