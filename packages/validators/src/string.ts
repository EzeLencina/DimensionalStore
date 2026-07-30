import { z } from 'zod';
import { REGEX, LIMITS } from '@tienda/constants';

export const emailSchema = z
  .string()
  .min(1)
  .max(LIMITS.MAX_EMAIL_LENGTH)
  .regex(REGEX.EMAIL, 'Email inválido')
  .transform((v) => v.toLowerCase());

export const slugSchema = z
  .string()
  .min(1)
  .max(LIMITS.MAX_NAME_LENGTH)
  .regex(REGEX.SLUG, 'Slug inválido');

export const skuSchema = z
  .string()
  .min(1)
  .max(LIMITS.MAX_SKU_LENGTH)
  .regex(REGEX.SKU, 'SKU inválido');

export const phoneSchema = z.string().regex(REGEX.PHONE, 'Teléfono inválido').optional();

export const nameSchema = z.string().min(1).max(LIMITS.MAX_NAME_LENGTH);

export const descriptionSchema = z.string().max(LIMITS.MAX_DESCRIPTION_LENGTH).optional();
