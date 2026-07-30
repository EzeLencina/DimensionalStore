import { extname } from 'node:path';

export class FileSanitizer {
  private static readonly UNSAFE_PATTERN = /[<>:"/\\|?*\x00-\x1f]/g;
  private static readonly MAX_FILENAME_LENGTH = 255;
  private static readonly REPLACEMENT_CHAR = '_';

  sanitizeFilename(filename: string): string {
    const withoutExtension = filename.replace(/\.[^.]+$/, '');
    const ext = extname(filename);

    const sanitized = withoutExtension
      .replace(FileSanitizer.UNSAFE_PATTERN, FileSanitizer.REPLACEMENT_CHAR)
      .replace(/\s+/g, FileSanitizer.REPLACEMENT_CHAR)
      .replace(/_+/g, FileSanitizer.REPLACEMENT_CHAR)
      .replace(/^_+|_+$/g, '')
      .substring(0, FileSanitizer.MAX_FILENAME_LENGTH - ext.length)
      .toLowerCase();

    return `${sanitized}${ext}`;
  }

  sanitizePath(path: string): string {
    return path
      .split('/')
      .map((segment) => this.sanitizeFilename(segment))
      .join('/');
  }

  generateSafeFilename(original: string): string {
    const ext = extname(original);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const safe = this.sanitizeFilename(original.replace(ext, ''));
    return `${safe}-${timestamp}-${random}${ext}`;
  }

  validateExtension(filename: string, allowedExtensions: string[]): boolean {
    const ext = extname(filename).toLowerCase();
    return allowedExtensions.includes(ext);
  }
}
