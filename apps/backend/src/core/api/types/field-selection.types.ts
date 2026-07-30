export interface FieldSelectionParams {
  fields?: string[];
  expand?: string[];
  include?: string[];
  exclude?: string[];
}

export interface FieldSelectionInput {
  fields?: string;
  expand?: string;
  include?: string;
  exclude?: string;
  allowedFields?: string[];
  allowedExpand?: string[];
}
