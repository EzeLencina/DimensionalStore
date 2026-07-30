import { IdentityException } from '../exceptions/identity.exception';

export type DocumentType = 'DNI' | 'RUC' | 'CPF' | 'CNPJ' | 'NIT' | 'PASSPORT' | 'RFC' | 'CURP' | 'OTHER';

const DOCUMENT_MIN_LENGTH = 3;
const DOCUMENT_MAX_LENGTH = 20;
const DOCUMENT_REGEX = /^[A-Za-z0-9.-]+$/;

export class DocumentNumber {
  private readonly value: string;
  private readonly type: DocumentType;

  constructor(value: string, type: DocumentType = 'OTHER') {
    const trimmed = value.trim().toUpperCase();
    if (trimmed.length < DOCUMENT_MIN_LENGTH || trimmed.length > DOCUMENT_MAX_LENGTH) {
      throw new IdentityException(
        'DOCUMENT_INVALID_LENGTH',
        `DocumentNumber must be between ${DOCUMENT_MIN_LENGTH} and ${DOCUMENT_MAX_LENGTH} characters`,
      );
    }
    if (!DOCUMENT_REGEX.test(trimmed)) {
      throw new IdentityException('DOCUMENT_INVALID_FORMAT', 'DocumentNumber can only contain letters, numbers, dots, and hyphens');
    }
    this.value = trimmed;
    this.type = type;
    Object.freeze(this);
  }

  getValue(): string {
    return this.value;
  }

  getType(): DocumentType {
    return this.type;
  }

  equals(other: DocumentNumber): boolean {
    return this.value === other.getValue() && this.type === other.getType();
  }

  toString(): string {
    return `${this.type}:${this.value}`;
  }
}
