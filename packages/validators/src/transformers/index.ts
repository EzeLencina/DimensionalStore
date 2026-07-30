export function trim(value: string): string {
  return value.trim();
}

export function lowercase(value: string): string {
  return value.toLowerCase();
}

export function uppercase(value: string): string {
  return value.toUpperCase();
}

export function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function sanitize(value: string): string {
  return value
    .replace(/[<>&"']/g, (char) => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '"': return '&quot;';
        case "'": return '&#x27;';
        default: return char;
      }
    })
    .slice(0, 10_000);
}

export function parseNumber(value: string): number | null {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function parseBoolean(value: string): boolean {
  return ['true', '1', 'yes', 'si', 'y', 's'].includes(value.toLowerCase());
}

export function parseDate(value: string): Date | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
