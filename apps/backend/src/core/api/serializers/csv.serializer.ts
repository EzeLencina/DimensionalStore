import { Injectable } from '@nestjs/common';

@Injectable()
export class CsvSerializer {
  readonly contentType = 'text/csv';

  serialize<T extends Record<string, unknown>>(data: T[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0] as Record<string, unknown>);
    const lines = data.map(row =>
      headers.map(h => {
        const value = (row as Record<string, unknown>)[h];
        if (value == null) return '';
        const str = String(value);
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      }).join(','),
    );

    return [headers.join(','), ...lines].join('\n');
  }
}
