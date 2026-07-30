import { IsString, IsOptional, IsNumber, IsBoolean, IsIn, Min } from 'class-validator';
import { CreatePriceListCommand } from '../../../application/commands';

const VALID_CURRENCIES = ['ARS', 'USD', 'EUR', 'BRL', 'CLP', 'UYU', 'MXN', 'COP'];
const VALID_TYPES = ['RETAIL', 'WHOLESALE', 'CHANNEL', 'CUSTOMER_GROUP', 'PROMOTIONAL'];

export class CreatePriceListDto {
  @IsString() name!: string;
  @IsString() code!: string;
  @IsOptional() @IsString() @IsIn(VALID_CURRENCIES) currency?: string;
  @IsOptional() @IsString() @IsIn(VALID_TYPES) type?: string;
  @IsOptional() @IsNumber() @Min(0) priority?: number;
  @IsOptional() @IsString() channel?: string | null;
  @IsOptional() @IsString() customerGroup?: string | null;
  @IsOptional() startsAt?: Date | null;
  @IsOptional() endsAt?: Date | null;
  @IsOptional() @IsBoolean() isDefault?: boolean;

  toCommand(tenantId: string): CreatePriceListCommand {
    return new CreatePriceListCommand(
      tenantId, this.name, this.code, this.currency, this.type,
      this.priority, this.channel, this.customerGroup,
      this.startsAt, this.endsAt, this.isDefault,
    );
  }
}

export class UpdatePriceListDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() @IsIn(VALID_CURRENCIES) currency?: string;
  @IsOptional() @IsString() @IsIn(VALID_TYPES) type?: string;
  @IsOptional() @IsNumber() @Min(0) priority?: number;
  @IsOptional() @IsString() channel?: string | null;
  @IsOptional() @IsString() customerGroup?: string | null;
  @IsOptional() startsAt?: Date | null;
  @IsOptional() endsAt?: Date | null;
}

export class SetVariantPriceDto {
  @IsString() priceListId!: string;
  @IsNumber() @Min(0) listAmount!: number;
  @IsOptional() @IsNumber() @Min(0) costAmount?: number | null;
  @IsOptional() @IsNumber() @Min(0) saleAmount?: number | null;
  @IsOptional() @IsNumber() @Min(1) minimumQuantity?: number;
}

export class SchedulePromotionDto {
  @IsNumber() @Min(0) promotionalAmount!: number;
  startsAt!: Date;
  endsAt!: Date;
}

export class PriceListListQueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsNumber() page?: number;
  @IsOptional() @IsNumber() limit?: number;
}
