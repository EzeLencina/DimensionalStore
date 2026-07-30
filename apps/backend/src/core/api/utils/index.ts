import { URL } from 'node:url';

export class ApiUrlBuilder {
  private baseUrl: string;
  private queryParams: Map<string, string> = new Map();

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.parseExistingQuery();
  }

  setParam(key: string, value: string | number | boolean): this {
    if (value != null) {
      this.queryParams.set(key, String(value));
    }
    return this;
  }

  setPagination(page: number, limit: number): this {
    return this.setParam('page', page).setParam('limit', limit);
  }

  setSort(sort: string): this {
    return this.setParam('sort', sort);
  }

  setFilter(filter: string): this {
    return this.setParam('filter', filter);
  }

  setSearch(search: string): this {
    return this.setParam('search', search);
  }

  setFields(fields: string): this {
    return this.setParam('fields', fields);
  }

  build(): string {
    if (this.queryParams.size === 0) return this.baseUrl;

    const separator = this.baseUrl.includes('?') ? '&' : '?';
    const params: string[] = [];

    this.queryParams.forEach((value, key) => {
      params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    });

    return `${this.baseUrl}${separator}${params.join('&')}`;
  }

  reset(): this {
    this.queryParams.clear();
    return this;
  }

  private parseExistingQuery(): void {
    try {
      const url = new URL(this.baseUrl, 'http://localhost');
      url.searchParams.forEach((value, key) => {
        this.queryParams.set(key, value);
      });
      this.baseUrl = `${url.origin}${url.pathname}`;
    } catch {
      // Ignore parse errors for relative URLs
    }
  }
}
