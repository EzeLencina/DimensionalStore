export class SessionValidators {
  static isValidSessionId(id: string): boolean {
    return id.length > 0 && id.length <= 128;
  }

  static isValidDeviceId(id: string): boolean {
    return id.length > 0 && id.length <= 128;
  }

  static isValidIpAddress(ip: string): boolean {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipv4Regex.test(ip)) {
      return ip.split('.').every(octet => parseInt(octet, 10) <= 255);
    }
    const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
    return ipv6Regex.test(ip);
  }

  static isValidUserAgent(ua: string): boolean {
    return ua.length > 0 && ua.length <= 1024;
  }

  static isValidTimezone(tz: string): boolean {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: tz });
      return true;
    } catch {
      return false;
    }
  }

  static isValidLocale(locale: string): boolean {
    return /^[a-z]{2}(_[A-Z]{2})?$/.test(locale);
  }

  static isValidDeviceType(type: string): boolean {
    return ['desktop', 'mobile', 'tablet', 'browser', 'api_client'].includes(type);
  }
}
