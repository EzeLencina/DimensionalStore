import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { CustomerAppService } from '../../services';
import type { CustomerTagRequestDto } from '../dto';
import { CreateCustomerTagCommand } from '../../application/commands';

@Controller('api/v1/admin/customer-tags')
export class AdminCustomerTagController {
  constructor(private readonly service: CustomerAppService) {}
  private tenant(headers: Record<string, string>): string { return headers['x-tenant-id'] || 'default'; }

  @Get()
  list(@Headers() headers: Record<string, string>) { return this.service.listCustomerTags(this.tenant(headers)); }

  @Post()
  create(@Headers() headers: Record<string, string>, @Body() dto: CustomerTagRequestDto) { return this.service.createCustomerTag(new CreateCustomerTagCommand(this.tenant(headers), dto.name, dto.slug, dto.description ?? null)); }
}
