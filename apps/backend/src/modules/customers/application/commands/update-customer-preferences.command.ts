export class UpdateCustomerPreferencesCommand {
  constructor(
    public readonly tenantId: string,
    public readonly customerId: string,
    public readonly language: string,
    public readonly currency: string,
    public readonly marketingEmail: boolean,
    public readonly marketingWhatsApp: boolean,
    public readonly marketingSms: boolean,
    public readonly orderNotifications: boolean,
    public readonly productRecommendations: boolean,
  ) {}
}
