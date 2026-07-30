import { URL } from 'node:url';

export class UrlBuilder {
  private baseUrl: string;
  private pathSegments: string[] = [];
  private queryParams: Map<string, string> = new Map();

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  addPath(segment: string): this {
    const clean = segment.replace(/^\/+|\/+$/g, '');
    this.pathSegments.push(clean);
    return this;
  }

  addQueryParam(key: string, value: string | number | boolean): this {
    this.queryParams.set(key, String(value));
    return this;
  }

  addQueryParams(params: Record<string, string | number | boolean | undefined | null>): this {
    for (const [key, value] of Object.entries(params)) {
      if (value != null) {
        this.queryParams.set(key, String(value));
      }
    }
    return this;
  }

  build(): string {
    const path = this.pathSegments.length > 0
      ? `/${this.pathSegments.join('/')}`
      : '';

    let url = `${this.baseUrl}${path}`;

    if (this.queryParams.size > 0) {
      const params: string[] = [];
      this.queryParams.forEach((value, key) => {
        params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      });
      url += `?${params.join('&')}`;
    }

    new URL(url);
    return url;
  }

  reset(): this {
    this.pathSegments = [];
    this.queryParams.clear();
    return this;
  }
}
