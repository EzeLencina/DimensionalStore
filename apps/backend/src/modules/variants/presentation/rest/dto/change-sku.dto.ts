import { IsString } from 'class-validator';
import { ChangeVariantSkuCommand } from '../../../application/commands';

export class ChangeSkuDto {
  @IsString() sku!: string;

  toCommand(): ChangeVariantSkuCommand {
    return new ChangeVariantSkuCommand(this.sku);
  }
}
