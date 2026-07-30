export { CartItem } from './cart-item';
export { CartSummary } from './cart-summary';
export { Coupon } from './coupon';
export { GiftCard } from './gift-card';
export { ShippingCalculator } from './shipping';
export { Totals } from './totals';
export { RecommendedProducts } from './recommended-products';
export { EmptyCart } from './empty-cart';
export { CartLoading } from './loading';
export { StickySummary } from './sticky-summary';
export {
  mockCartItems, recommendedProducts, shippingOptions,
  mockCoupons, mockGiftCards, defaultCartSummary,
} from './mock-data';
export type {
  CartItem as CartItemType, AppliedCoupon, AppliedGiftCard,
  ShippingOption, CartSummary as CartSummaryType, RecommendedProduct,
} from './mock-data';
