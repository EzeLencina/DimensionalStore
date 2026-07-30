import { IdentityException } from '../exceptions/identity.exception';

const VALID_TIMEZONES = new Set([
  'UTC',
  'America/Argentina/Buenos_Aires',
  'America/Argentina/Cordoba',
  'America/Argentina/Salta',
  'America/Argentina/Jujuy',
  'America/Argentina/Tucuman',
  'America/Argentina/Catamarca',
  'America/Argentina/La_Rioja',
  'America/Argentina/San_Juan',
  'America/Argentina/Mendoza',
  'America/Argentina/Rio_Gallegos',
  'America/Argentina/Ushuaia',
  'America/Santiago',
  'America/Sao_Paulo',
  'America/Mexico_City',
  'America/Lima',
  'America/Bogota',
  'America/Caracas',
  'America/Panama',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/Madrid',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Australia/Sydney',
  'Pacific/Auckland',
  'Africa/Cairo',
  'Africa/Johannesburg',
]);

export class Timezone {
  private readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim();
    if (!VALID_TIMEZONES.has(trimmed)) {
      throw new IdentityException('TIMEZONE_INVALID', `Timezone '${trimmed}' is not supported`);
    }
    this.value = trimmed;
    Object.freeze(this);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Timezone): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
