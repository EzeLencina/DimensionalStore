export class StartCheckoutRequestDto {
  cartId!: string;
}

export class UpdateAddressRequestDto {
  recipientName!: string; phone?: string | null;
  street!: string; number!: string; apartment?: string | null;
  city!: string; province!: string; postalCode!: string;
  country?: string; notes?: string | null;
}

export class SelectShippingMethodRequestDto {
  code!: string;
}

export class SelectPaymentMethodRequestDto {
  code!: string;
}
