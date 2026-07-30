export type VariantAttribute = {
  name: string;
  value: string;
};

export class VariantAttributes {
  private readonly items: readonly VariantAttribute[];

  private constructor(items: VariantAttribute[]) {
    this.items = Object.freeze([...items]);
    Object.freeze(this);
  }

  static create(items: VariantAttribute[]): VariantAttributes {
    for (const attr of items) {
      if (!attr.name || !attr.name.trim()) {
        throw new Error('Attribute name cannot be empty');
      }
      if (!attr.value || !attr.value.trim()) {
        throw new Error('Attribute value cannot be empty');
      }
    }

    const keys = items.map(a => a.name.toLowerCase().trim());
    if (new Set(keys).size !== keys.length) {
      throw new Error('Duplicate attribute names are not allowed');
    }

    return new VariantAttributes(items);
  }

  static empty(): VariantAttributes {
    return new VariantAttributes([]);
  }

  getItems(): readonly VariantAttribute[] { return this.items; }
  toArray(): VariantAttribute[] { return [...this.items]; }
  isEmpty(): boolean { return this.items.length === 0; }

  hasAttribute(name: string): boolean {
    return this.items.some(a => a.name.toLowerCase() === name.toLowerCase().trim());
  }

  getValue(name: string): string | undefined {
    return this.items.find(a => a.name.toLowerCase() === name.toLowerCase().trim())?.value;
  }

  equals(other: VariantAttributes): boolean {
    if (this.items.length !== other.items.length) return false;
    return this.items.every((a, i) => {
      const b = other.items[i];
      return b !== undefined && a.name === b.name && a.value === b.value;
    });
  }

  toString(): string {
    return this.items.map(a => `${a.name}:${a.value}`).join('|');
  }
}
