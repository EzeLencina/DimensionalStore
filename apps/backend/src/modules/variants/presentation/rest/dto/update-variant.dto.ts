import { IsString, IsOptional } from 'class-validator';
import { UpdateVariantCommand } from '../../../application/commands';

export class UpdateVariantDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() barcode?: string;

  toCommand(): UpdateVariantCommand {
    return new UpdateVariantCommand(this.name, this.barcode);
  }
}
