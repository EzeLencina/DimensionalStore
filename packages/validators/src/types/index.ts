export interface ValidationResult {
  success: boolean;
  data?: unknown;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  received?: unknown;
  expected?: unknown;
}

export type ValidationMode = 'strict' | 'strip' | 'passthrough';
