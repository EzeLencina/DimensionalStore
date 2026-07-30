export class TrustDeviceCommand {
  constructor(
    public readonly userId: string,
    public readonly deviceId: string,
  ) {}
}

export class RemoveTrustedDeviceCommand {
  constructor(
    public readonly userId: string,
    public readonly deviceId: string,
  ) {}
}
