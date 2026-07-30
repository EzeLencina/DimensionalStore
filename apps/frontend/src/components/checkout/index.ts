export { CheckoutSteps } from './steps';
export { CustomerForm } from './customer';
export { AddressForm } from './address';
export { ShippingSelector } from './shipping';
export { PaymentMethods, PaymentCard } from './payment';
export { OrderSummary } from './summary';
export { OrderConfirmation } from './confirmation';
export { ProgressIndicator } from './progress';
export { SecurityBadge } from './security';
export { FieldError } from './errors';
export { CheckoutLoading } from './loading';
export {
  provinces, shippingMethods, paymentMethods,
  mockCustomer, mockAddress, mockOrderNumber,
  checkoutSteps, cardBrands,
} from './mock-data';
export type {
  CheckoutCustomer, CheckoutAddress, CheckoutShippingMethod,
  CheckoutPaymentMethod, CheckoutStepId,
} from './mock-data';
