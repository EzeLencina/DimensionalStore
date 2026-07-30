import { Injectable } from '@nestjs/common';
import { HttpDeserializationErrorException } from '../exceptions';

export interface HttpDeserializer {
  deserialize<T>(data: string | Buffer, contentType?: string): T;
}

@Injectable()
export class ResponseDeserializer implements HttpDeserializer {
  deserialize<T>(data: string | Buffer, contentType?: string): T {
    const str = typeof data === 'string' ? data : data.toString('utf-8');

    if (contentType?.includes('application/json') || this.isJsonString(str)) {
      try {
        return JSON.parse(str) as T;
      } catch (error) {
        throw new HttpDeserializationErrorException(
          'Failed to parse JSON response',
          { error: (error as Error).message },
        );
      }
    }

    return str as T;
  }

  private isJsonString(data: string): boolean {
    const trimmed = data.trim();
    return (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
           (trimmed.startsWith('[') && trimmed.endsWith(']'));
  }
}
