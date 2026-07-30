import { Injectable } from '@nestjs/common';

export interface ISerializer {
  serialize<T>(data: T): string;
  contentType: string;
}

@Injectable()
export class JsonSerializer implements ISerializer {
  readonly contentType = 'application/json';

  serialize<T>(data: T): string {
    return JSON.stringify(data);
  }
}
