export type CreateCollectionDto = {
  name: string;
  slug?: string;
  description?: string | null;
  type?: string;
  status?: string;
  visibility?: string;
  displayOrder?: number;
  startAt?: string | null;
  endAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};
