import { z } from 'zod';

export const booleanSchema = z.union([
  z.boolean(),
  z.enum(['true', 'false']).transform((v) => v === 'true'),
]);

export const colorSchema = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid hex color');

export const localeSchema = z
  .string()
  .regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'Invalid locale (e.g. es-AR)');

export const languageSchema = z
  .string()
  .regex(/^[a-z]{2,3}$/, 'Invalid language code (e.g. es, en)');

export const timeZoneSchema = z.string().refine(
  (val) => {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: val });
      return true;
    } catch {
      return false;
    }
  },
  { message: 'Invalid time zone' },
);

export const currencySchema = z
  .string()
  .length(3)
  .regex(/^[A-Z]{3}$/, 'Invalid currency code (e.g. ARS, USD)');
