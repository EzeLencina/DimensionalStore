export function formatDate(date: Date, locale = 'es-AR'): string {
  return date.toLocaleDateString(locale);
}

export function formatDateTime(date: Date, locale = 'es-AR'): string {
  return date.toLocaleString(locale);
}

export function toISO(date: Date): string {
  return date.toISOString();
}

export function isExpired(date: Date): boolean {
  return new Date() > date;
}

export function daysBetween(from: Date, to: Date): number {
  const diff = to.getTime() - from.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}
