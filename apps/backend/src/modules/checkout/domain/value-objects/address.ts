export type AddressPrimitives = {
  recipientName: string; phone: string | null;
  street: string; number: string; apartment: string | null;
  city: string; province: string; postalCode: string;
  country: string; notes: string | null;
};

export class Address {
  private readonly recipientName!: string;
  private readonly phone!: string | null;
  private readonly street!: string;
  private readonly number!: string;
  private readonly apartment!: string | null;
  private readonly city!: string;
  private readonly province!: string;
  private readonly postalCode!: string;
  private readonly country!: string;
  private readonly notes!: string | null;

  private constructor(props: AddressPrimitives) {
    Object.assign(this, props);
    Object.freeze(this);
  }

  static create(props: AddressPrimitives): Address {
    if (!props.recipientName?.trim()) throw new Error('recipientName is required');
    if (!props.street?.trim()) throw new Error('street is required');
    if (!props.number?.trim()) throw new Error('number is required');
    if (!props.city?.trim()) throw new Error('city is required');
    if (!props.province?.trim()) throw new Error('province is required');
    if (!props.postalCode?.trim()) throw new Error('postalCode is required');
    if (!props.country?.trim()) props.country = 'AR';
    return new Address(props);
  }

  toPrimitives(): AddressPrimitives {
    return {
      recipientName: this.recipientName, phone: this.phone,
      street: this.street, number: this.number, apartment: this.apartment,
      city: this.city, province: this.province, postalCode: this.postalCode,
      country: this.country, notes: this.notes,
    };
  }
}
