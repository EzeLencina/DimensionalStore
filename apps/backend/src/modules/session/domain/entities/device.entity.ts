import { DeviceId } from '../value-objects/device-id.value-object';
import { DeviceType, DeviceInfo } from '../types';

export class Device {
  private readonly deviceId: DeviceId;
  private readonly userId: string;
  private type: DeviceType;
  private name: string;
  private os: string;
  private browser: string;
  private isTrusted: boolean;
  private isRemembered: boolean;
  private readonly firstSeen: Date;
  private lastSeen: Date;

  constructor(params: {
    deviceId?: DeviceId;
    userId: string;
    type: DeviceType;
    name?: string;
    os?: string;
    browser?: string;
    isTrusted?: boolean;
    isRemembered?: boolean;
    firstSeen?: Date;
    lastSeen?: Date;
  }) {
    this.deviceId = params.deviceId ?? new DeviceId();
    this.userId = params.userId;
    this.type = params.type;
    this.name = params.name ?? '';
    this.os = params.os ?? '';
    this.browser = params.browser ?? '';
    this.isTrusted = params.isTrusted ?? false;
    this.isRemembered = params.isRemembered ?? false;
    this.firstSeen = params.firstSeen ?? new Date();
    this.lastSeen = params.lastSeen ?? new Date();
  }

  getDeviceId(): DeviceId { return this.deviceId; }
  getUserId(): string { return this.userId; }
  getType(): DeviceType { return this.type; }
  getName(): string { return this.name; }
  getOs(): string { return this.os; }
  getBrowser(): string { return this.browser; }
  isTrustedDevice(): boolean { return this.isTrusted; }
  isRememberedDevice(): boolean { return this.isRemembered; }
  getFirstSeen(): Date { return this.firstSeen; }
  getLastSeen(): Date { return this.lastSeen; }

  markTrusted(): void { this.isTrusted = true; this.touch(); }
  markUntrusted(): void { this.isTrusted = false; this.touch(); }
  markRemembered(): void { this.isRemembered = true; this.touch(); }
  unmarkRemembered(): void { this.isRemembered = false; this.touch(); }

  toInfo(): DeviceInfo {
    return {
      type: this.type,
      name: this.name,
      os: this.os,
      browser: this.browser,
      isTrusted: this.isTrusted,
      isRemembered: this.isRemembered,
    };
  }

  private touch(): void { this.lastSeen = new Date(); }
}
