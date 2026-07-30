import type { CreateCustomerCommand, UpdateCustomerProfileCommand, AddCustomerAddressCommand, UpdateCustomerAddressCommand, UpdateCustomerPreferencesCommand, CreateCustomerTagCommand, AddCustomerNoteCommand } from '../commands';

export class CustomerValidator {
  static validateCreate(cmd: CreateCustomerCommand): string[] {
    const errors: string[] = [];
    if (!cmd.email?.trim()) errors.push('email is required');
    if (!cmd.firstName?.trim()) errors.push('firstName is required');
    if (!cmd.lastName?.trim()) errors.push('lastName is required');
    return errors;
  }
  static validateProfile(cmd: UpdateCustomerProfileCommand): string[] {
    const errors: string[] = [];
    if (!cmd.firstName?.trim()) errors.push('firstName is required');
    if (!cmd.lastName?.trim()) errors.push('lastName is required');
    return errors;
  }
  static validateAddress(cmd: AddCustomerAddressCommand | UpdateCustomerAddressCommand): string[] {
    const errors: string[] = [];
    if (!cmd.recipientName?.trim()) errors.push('recipientName is required');
    if (!cmd.street?.trim()) errors.push('street is required');
    if (!cmd.number?.trim()) errors.push('number is required');
    if (!cmd.city?.trim()) errors.push('city is required');
    if (!cmd.province?.trim()) errors.push('province is required');
    if (!cmd.postalCode?.trim()) errors.push('postalCode is required');
    if (!cmd.country?.trim()) errors.push('country is required');
    return errors;
  }
  static validatePreferences(cmd: UpdateCustomerPreferencesCommand): string[] { return cmd.language?.trim() ? [] : ['language is required']; }
  static validateTag(cmd: CreateCustomerTagCommand): string[] { return cmd.name?.trim() && cmd.slug?.trim() ? [] : ['name and slug are required']; }
  static validateNote(cmd: AddCustomerNoteCommand): string[] { return cmd.content?.trim() ? [] : ['content is required']; }
}
