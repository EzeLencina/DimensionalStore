import { Injectable } from '@nestjs/common';

@Injectable()
export class XmlSerializer {
  readonly contentType = 'application/xml';

  serialize<T extends Record<string, unknown>>(data: T | T[], rootName = 'root', itemName = 'item'): string {
    const toXml = (obj: unknown, name: string): string => {
      if (obj == null) return `<${name}/>`;

      if (Array.isArray(obj)) {
        return obj.map(item => toXml(item, itemName)).join('\n');
      }

      if (typeof obj === 'object') {
        const entries = Object.entries(obj as Record<string, unknown>)
          .map(([key, value]) => toXml(value, key))
          .join('\n  ');
        return `<${name}>\n  ${entries}\n</${name}>`;
      }

      return `<${name}>${String(obj)}</${name}>`;
    };

    const xml = Array.isArray(data)
      ? data.map(item => toXml(item, itemName)).join('\n')
      : toXml(data, rootName);

    return `<?xml version="1.0" encoding="UTF-8"?>\n${xml}`;
  }
}
