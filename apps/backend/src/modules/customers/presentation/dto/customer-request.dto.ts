export type CreateCustomerRequestDto = { email: string; firstName: string; lastName: string; source?: string; locale?: string; preferredCurrency?: string; userId?: string | null; phone?: string | null };
export type UpdateCustomerProfileRequestDto = { firstName: string; lastName: string; phone?: string | null; documentType?: string | null; documentNumber?: string | null };
export type CustomerAddressRequestDto = { type: string; label?: string | null; recipientName: string; phone?: string | null; street: string; number: string; apartment?: string | null; city: string; province: string; postalCode: string; country: string; notes?: string | null };
export type CustomerPreferencesRequestDto = { language: string; currency: string; marketingEmail: boolean; marketingWhatsApp: boolean; marketingSms: boolean; orderNotifications: boolean; productRecommendations: boolean };
export type CustomerTagRequestDto = { name: string; slug: string; description?: string | null };
export type CustomerNoteRequestDto = { content: string; createdBy: string };
