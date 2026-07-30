export type CustomerPreferencesPrimitives = {
  customerId: string; language: string; currency: string; marketingEmail: boolean; marketingWhatsApp: boolean; marketingSms: boolean; orderNotifications: boolean; productRecommendations: boolean; updatedAt: Date;
};

export class CustomerPreferences {
  constructor(
    private customerId: string,
    private language: string,
    private currency: string,
    private marketingEmail: boolean,
    private marketingWhatsApp: boolean,
    private marketingSms: boolean,
    private orderNotifications: boolean,
    private productRecommendations: boolean,
    private updatedAt: Date = new Date(),
  ) {}

  static fromPrimitives(p: CustomerPreferencesPrimitives): CustomerPreferences {
    return new CustomerPreferences(p.customerId, p.language, p.currency, p.marketingEmail, p.marketingWhatsApp, p.marketingSms, p.orderNotifications, p.productRecommendations, p.updatedAt);
  }

  toPrimitives(): CustomerPreferencesPrimitives {
    return { customerId: this.customerId, language: this.language, currency: this.currency, marketingEmail: this.marketingEmail, marketingWhatsApp: this.marketingWhatsApp, marketingSms: this.marketingSms, orderNotifications: this.orderNotifications, productRecommendations: this.productRecommendations, updatedAt: this.updatedAt };
  }
}
