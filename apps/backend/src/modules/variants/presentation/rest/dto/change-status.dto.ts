import { IsEnum } from 'class-validator';
import { ChangeVariantStatusCommand } from '../../../application/commands';

export class ChangeStatusDto {
  @IsEnum(['ACTIVE', 'INACTIVE'] as const)
  status!: string;

  toCommand(): ChangeVariantStatusCommand {
    return new ChangeVariantStatusCommand(this.status);
  }
}
