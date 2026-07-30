import { zIndex } from '../tokens/z-index';

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function isReducedMotion(): boolean {
  if (!isBrowser()) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function formatPrice(
  amount: number,
  currency: string = 'ARS',
  locale: string = 'es-AR',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCompactPrice(
  amount: number,
  currency: string = 'ARS',
  locale: string = 'es-AR',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    compactDisplay: 'short',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(amount);
}

export function zIndexMax(...layers: (keyof typeof zIndex)[]): number {
  const values = layers.map((l) => zIndex[l]);
  const numericValues: number[] = [];
  for (const v of values) {
    if (typeof v === 'number') {
      numericValues.push(v);
    }
  }
  return numericValues.length > 0 ? Math.max(...numericValues) : 0;
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '\u2026';
}
