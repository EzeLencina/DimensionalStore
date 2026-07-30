export type CustomerAddressDto = {
  id: string; type: string; label: string | null; recipientName: string; phone: string | null; street: string; number: string; apartment: string | null; city: string; province: string; postalCode: string; country: string; notes: string | null; isDefaultShipping: boolean; isDefaultBilling: boolean;
};

export type CustomerPreferencesDto = {
  language: string; currency: string; marketingEmail: boolean; marketingWhatsApp: boolean; marketingSms: boolean; orderNotifications: boolean; productRecommendations: boolean;
};

export type CustomerNoteDto = {
  id: string; content: string; createdBy: string; createdAt: string; updatedAt: string | null; deletedAt: string | null;
};

export type CustomerTagDto = {
  id: string; name: string; slug: string; description: string | null;
};

export type CustomerResponseDto = {
  id: string; tenantId: string; userId: string | null; email: string; firstName: string; lastName: string; phone: string | null;
  documentType: string | null; documentNumber: string | null; status: string; source: string; locale: string; preferredCurrency: string;
  acceptsMarketing: boolean; emailVerified: boolean; phoneVerified: boolean; lastOrderAt: string | null; firstOrderAt: string | null;
  totalOrders: number; totalSpent: number; averageOrderValue: number; createdAt: string; updatedAt: string; deletedAt: string | null; version: number;
  addresses?: CustomerAddressDto[]; preferences?: CustomerPreferencesDto | null; tags?: CustomerTagDto[]; notes?: CustomerNoteDto[];
};

export type CustomerListResponseDto = { items: CustomerResponseDto[]; total: number; limit: number; offset: number };
