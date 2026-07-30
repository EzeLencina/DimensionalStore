import { Injectable } from '@nestjs/common';
import { Readable, Transform, pipeline } from 'node:stream';

@Injectable()
export class StreamAdapter {
  bufferToStream(buffer: Buffer): Readable {
    return Readable.from(buffer);
  }

  streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  createTransform(options?: { maxSize?: number }): Transform {
    let totalSize = 0;
    const maxSize = options?.maxSize;

    return new Transform({
      transform(chunk: Buffer, _encoding, callback) {
        totalSize += chunk.length;
        if (maxSize && totalSize > maxSize) {
          callback(new Error(`Stream exceeded maximum size of ${maxSize} bytes`));
          return;
        }
        callback(null, chunk);
      },
    });
  }

  async pipeToBuffer(stream: Readable): Promise<Buffer> {
    return this.streamToBuffer(stream);
  }
}
