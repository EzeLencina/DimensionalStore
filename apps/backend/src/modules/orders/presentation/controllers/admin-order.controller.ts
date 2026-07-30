import { Controller, Get, Post, Delete, Body, Param, Headers, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { OrderAppService } from '../../services';
import type { OrderResponseDto, OrderListResponseDto, OrderNoteResponseDto } from '../../application/dto';
import {
  ConfirmPaymentCommand, FailPaymentCommand, RetryPaymentCommand,
  StartProcessingCommand, MarkReadyCommand, MarkShippedCommand,
  MarkDeliveredCommand, CancelOrderCommand, ExpireOrderCommand,
  AddOrderNoteCommand, RemoveOrderNoteCommand,
} from '../../application/commands';

@Controller('api/v1/admin/orders')
export class AdminOrderController {
  constructor(private readonly orderService: OrderAppService) {}

  private getTenantId(headers: Record<string, string>): string {
    return headers['x-tenant-id'] || 'default';
  }

  @Get()
  async list(
    @Headers() headers: Record<string, string>,
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
    @Query('orderNumber') orderNumber?: string,
    @Query('email') email?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('minTotal') minTotal?: string,
    @Query('maxTotal') maxTotal?: string,
    @Query('paymentStatus') paymentStatus?: string,
    @Query('fulfillmentStatus') fulfillmentStatus?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ): Promise<OrderListResponseDto> {
    return this.orderService.listOrders(this.getTenantId(headers), {
      status, customerId, orderNumber, email,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
      minTotal: minTotal ? Number(minTotal) : undefined,
      maxTotal: maxTotal ? Number(maxTotal) : undefined,
      paymentStatus, fulfillmentStatus,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      sortBy, sortOrder: sortOrder as 'asc' | 'desc' | undefined,
    });
  }

  @Get(':id')
  async getById(@Headers() headers: Record<string, string>, @Param('id') id: string): Promise<OrderResponseDto> {
    return this.orderService.getOrderById(id, this.getTenantId(headers));
  }

  @Get('number/:orderNumber')
  async getByNumber(@Headers() headers: Record<string, string>, @Param('orderNumber') orderNumber: string): Promise<OrderResponseDto> {
    return this.orderService.getOrderByNumber(orderNumber, this.getTenantId(headers));
  }

  @Get(':id/history')
  async getHistory(@Headers() headers: Record<string, string>, @Param('id') id: string): Promise<any> {
    return this.orderService.getOrderHistory(id, this.getTenantId(headers));
  }

  @Post(':id/notes')
  @HttpCode(HttpStatus.CREATED)
  async addNote(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
    @Body('content') content: string,
    @Body('visibility') visibility: string,
  ): Promise<OrderNoteResponseDto> {
    return this.orderService.addNote(new AddOrderNoteCommand(
      this.getTenantId(headers), id, content, visibility ?? 'INTERNAL', 'admin',
    ));
  }

  @Delete(':id/notes/:noteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeNote(@Headers() headers: Record<string, string>, @Param('id') id: string, @Param('noteId') noteId: string): Promise<void> {
    const tenantId = this.getTenantId(headers);
    await this.orderService.removeNote(new RemoveOrderNoteCommand(tenantId, id, noteId));
  }

  @Post(':id/confirm-payment')
  @HttpCode(HttpStatus.OK)
  async confirmPayment(@Headers() headers: Record<string, string>, @Param('id') id: string): Promise<OrderResponseDto> {
    return this.orderService.confirmPayment(new ConfirmPaymentCommand(this.getTenantId(headers), id));
  }

  @Post(':id/payment-failed')
  @HttpCode(HttpStatus.OK)
  async paymentFailed(@Headers() headers: Record<string, string>, @Param('id') id: string, @Body('reason') reason?: string): Promise<OrderResponseDto> {
    return this.orderService.failPayment(new FailPaymentCommand(this.getTenantId(headers), id, reason));
  }

  @Post(':id/retry-payment')
  @HttpCode(HttpStatus.OK)
  async retryPayment(@Headers() headers: Record<string, string>, @Param('id') id: string): Promise<OrderResponseDto> {
    return this.orderService.retryPayment(new RetryPaymentCommand(this.getTenantId(headers), id));
  }

  @Post(':id/start-processing')
  @HttpCode(HttpStatus.OK)
  async startProcessing(@Headers() headers: Record<string, string>, @Param('id') id: string): Promise<OrderResponseDto> {
    return this.orderService.startProcessing(new StartProcessingCommand(this.getTenantId(headers), id));
  }

  @Post(':id/ready-for-pickup')
  @HttpCode(HttpStatus.OK)
  async readyForPickup(@Headers() headers: Record<string, string>, @Param('id') id: string): Promise<OrderResponseDto> {
    return this.orderService.markReady(new MarkReadyCommand(this.getTenantId(headers), id));
  }

  @Post(':id/ship')
  @HttpCode(HttpStatus.OK)
  async ship(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
    @Body('carrierCode') carrierCode?: string,
    @Body('trackingNumber') trackingNumber?: string,
    @Body('trackingUrl') trackingUrl?: string,
  ): Promise<OrderResponseDto> {
    return this.orderService.markShipped(new MarkShippedCommand(this.getTenantId(headers), id, carrierCode, trackingNumber, trackingUrl));
  }

  @Post(':id/deliver')
  @HttpCode(HttpStatus.OK)
  async deliver(@Headers() headers: Record<string, string>, @Param('id') id: string): Promise<OrderResponseDto> {
    return this.orderService.markDelivered(new MarkDeliveredCommand(this.getTenantId(headers), id));
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
    @Body('reasonCode') reasonCode: string,
    @Body('reasonText') reasonText?: string,
  ): Promise<OrderResponseDto> {
    return this.orderService.cancelOrder(new CancelOrderCommand(this.getTenantId(headers), id, reasonCode, reasonText));
  }

  @Post(':id/expire')
  @HttpCode(HttpStatus.OK)
  async expire(@Headers() headers: Record<string, string>, @Param('id') id: string): Promise<OrderResponseDto> {
    return this.orderService.expireOrder(new ExpireOrderCommand(this.getTenantId(headers), id));
  }
}
