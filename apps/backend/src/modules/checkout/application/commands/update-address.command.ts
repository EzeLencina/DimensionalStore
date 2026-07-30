import type { AddressPrimitives } from '../../domain';

export class UpdateAddressCommand implements AddressPrimitives {
  constructor(
    public readonly recipientName: string, public readonly phone: string | null,
    public readonly street: string, public readonly number: string,
    public readonly apartment: string | null,
    public readonly city: string, public readonly province: string,
    public readonly postalCode: string, public readonly country: string,
    public readonly notes: string | null,
  ) {}
}
