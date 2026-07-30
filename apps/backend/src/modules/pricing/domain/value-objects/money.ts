const VALID_CURRENCIES = ['ARS', 'USD', 'EUR', 'BRL', 'CLP', 'UYU', 'MXN', 'COP'];

export class Money {
  private readonly _amount: number;
  private readonly _currency: string;

  private constructor(amount: number, currency: string) {
    this._amount = amount;
    this._currency = currency;
    Object.freeze(this);
  }

  static fromCents(amount: number, currency = 'ARS'): Money {
    if (!Number.isInteger(amount)) throw new Error('Money amount must be an integer (cents)');
    if (amount < 0) throw new Error('Money amount cannot be negative');
    if (!VALID_CURRENCIES.includes(currency)) throw new Error(`Invalid currency: ${currency}`);
    return new Money(amount, currency);
  }

  static zero(currency = 'ARS'): Money { return Money.fromCents(0, currency); }

  get amount(): number { return this._amount; }
  get currency(): string { return this._currency; }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return Money.fromCents(this._amount + other._amount, this._currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    const result = this._amount - other._amount;
    if (result < 0) throw new Error('Cannot subtract: result would be negative');
    return Money.fromCents(result, this._currency);
  }

  multiply(factor: number): Money {
    return Money.fromCents(Math.round(this._amount * factor), this._currency);
  }

  isZero(): boolean { return this._amount === 0; }
  isGreaterThan(other: Money): boolean { this.assertSameCurrency(other); return this._amount > other._amount; }
  isLessThan(other: Money): boolean { this.assertSameCurrency(other); return this._amount < other._amount; }
  equals(other: Money): boolean { return this._amount === other._amount && this._currency === other._currency; }
  toCents(): number { return this._amount; }
  toDecimal(): number { return this._amount / 100; }

  private assertSameCurrency(other: Money): void {
    if (this._currency !== other._currency) throw new Error(`Currency mismatch: ${this._currency} vs ${other._currency}`);
  }
}
