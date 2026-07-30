export interface CreateProductRequestDto {
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  productType?: 'PHYSICAL' | 'DIGITAL' | 'SERVICE' | 'BUNDLE';
  visibility?: 'PUBLIC' | 'PRIVATE' | 'HIDDEN';
  condition?: 'NEW' | 'REFURBISHED' | 'USED';
  warrantyMonths?: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface UpdateProductRequestDto {
  name?: string;
  slug?: string;
  shortDescription?: string | null;
  description?: string | null;
  warrantyMonths?: number | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  condition?: 'NEW' | 'REFURBISHED' | 'USED';
}

export interface ChangeStatusRequestDto {
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
}

export interface ChangeVisibilityRequestDto {
  visibility: 'PUBLIC' | 'PRIVATE' | 'HIDDEN';
}
