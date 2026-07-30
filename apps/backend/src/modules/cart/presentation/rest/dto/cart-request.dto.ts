export class AddCartItemRequestDto {
  productVariantId!: string;
  quantity!: number;
}

export class UpdateCartItemQuantityRequestDto {
  quantity!: number;
}

export class MergeCartRequestDto {
  sourceGuestToken!: string;
}
