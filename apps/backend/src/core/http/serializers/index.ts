import { Injectable } from '@nestjs/common';
import { HttpSerializationErrorException } from '../exceptions';

export interface HttpSerializer {
  serialize(data: unknown): string | Buffer;
}

@Injectable()
export class JsonSerializer implements HttpSerializer {
  serialize(data: unknown): string {
    try {
      return JSON.stringify(data);
    } catch (error) {
      throw new HttpSerializationErrorException(
        'Failed to serialize data to JSON',
        { error: (error as Error).message },
      );
    }
  }
}
