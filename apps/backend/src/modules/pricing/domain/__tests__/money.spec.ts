import { Money } from '../value-objects/money';

describe('Money Value Object', () => {
  describe('fromCents', () => {
    it('should create from cents', () => {
      const m = Money.fromCents(10000);
      expect(m.toCents()).toBe(10000);
      expect(m.toDecimal()).toBe(100);
    });

    it('should throw on negative amount', () => {
      expect(() => Money.fromCents(-1)).toThrow();
    });

    it('should throw on non-integer', () => {
      expect(() => Money.fromCents(10.5)).toThrow();
    });

    it('should throw on invalid currency', () => {
      expect(() => Money.fromCents(100, 'GBP')).toThrow();
    });
  });

  describe('arithmetic', () => {
    it('should add', () => {
      const a = Money.fromCents(5000);
      const b = Money.fromCents(3000);
      expect(a.add(b).toCents()).toBe(8000);
    });

    it('should subtract', () => {
      const a = Money.fromCents(5000);
      const b = Money.fromCents(3000);
      expect(a.subtract(b).toCents()).toBe(2000);
    });

    it('should throw on negative subtract result', () => {
      const a = Money.fromCents(1000);
      const b = Money.fromCents(2000);
      expect(() => a.subtract(b)).toThrow();
    });

    it('should multiply', () => {
      const m = Money.fromCents(1000);
      expect(m.multiply(3).toCents()).toBe(3000);
    });

    it('should throw on currency mismatch', () => {
      const a = Money.fromCents(100, 'ARS');
      const b = Money.fromCents(100, 'USD');
      expect(() => a.add(b)).toThrow();
    });
  });

  describe('comparison', () => {
    it('should check zero', () => {
      expect(Money.fromCents(0).isZero()).toBe(true);
      expect(Money.fromCents(1).isZero()).toBe(false);
    });

    it('should compare', () => {
      expect(Money.fromCents(100).isGreaterThan(Money.fromCents(50))).toBe(true);
      expect(Money.fromCents(50).isLessThan(Money.fromCents(100))).toBe(true);
    });

    it('should check equals', () => {
      expect(Money.fromCents(100, 'USD').equals(Money.fromCents(100, 'USD'))).toBe(true);
      expect(Money.fromCents(100, 'USD').equals(Money.fromCents(100, 'ARS'))).toBe(false);
    });
  });
});
