import type { CancelOrderCommand, MarkShippedCommand, AddOrderNoteCommand } from '../commands';

export class OrderValidator {
  static validateCancel(cmd: CancelOrderCommand): string[] {
    const errors: string[] = [];
    if (!cmd.reasonCode?.trim()) errors.push('reasonCode is required');
    if (cmd.reasonText && cmd.reasonText.length > 1000) errors.push('reasonText too long (max 1000)');
    return errors;
  }

  static validateShipping(cmd: MarkShippedCommand): string[] {
    const errors: string[] = [];
    if (cmd.carrierCode && cmd.carrierCode.length > 20) errors.push('carrierCode too long (max 20)');
    if (cmd.trackingNumber && cmd.trackingNumber.length > 100) errors.push('trackingNumber too long (max 100)');
    if (cmd.trackingUrl && cmd.trackingUrl.length > 500) errors.push('trackingUrl too long (max 500)');
    return errors;
  }

  static validateNote(cmd: AddOrderNoteCommand): string[] {
    const errors: string[] = [];
    if (!cmd.content?.trim()) errors.push('content is required');
    if (cmd.content && cmd.content.length > 5000) errors.push('content too long (max 5000)');
    if (!['INTERNAL', 'CUSTOMER_VISIBLE'].includes(cmd.visibility)) errors.push('visibility must be INTERNAL or CUSTOMER_VISIBLE');
    if (!cmd.createdBy?.trim()) errors.push('createdBy is required');
    return errors;
  }
}
