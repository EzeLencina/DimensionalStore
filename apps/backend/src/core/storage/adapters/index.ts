import { Injectable } from '@nestjs/common';
import type { FileData } from '../types';

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@Injectable()
export class MulterAdapter {
  fromMulter(file: MulterFile): FileData {
    return {
      buffer: file.buffer,
      mimetype: file.mimetype,
      size: file.size,
      originalName: file.originalname,
      encoding: file.encoding,
    };
  }

  fromMulterArray(files: MulterFile[]): FileData[] {
    return files.map((f) => this.fromMulter(f));
  }
}

export { StreamAdapter } from './stream.adapter';
