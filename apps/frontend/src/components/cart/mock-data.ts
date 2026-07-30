export type CartItem = {
  id: string;
  productId: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  image: string;
  variantLabel?: string;
  variantValue?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  quantity: number;
  maxQuantity: number;
  inStock: boolean;
  stockCount: number;
  badge?: string;
  badgeVariant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
};

export type AppliedCoupon = {
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  label: string;
};

export type AppliedGiftCard = {
  code: string;
  amount: number;
  balance: number;
};

export type ShippingOption = {
  id: string;
  method: string;
  cost: number;
  estimatedDays: string;
  provider: string;
};

export type CartSummary = {
  subtotal: number;
  discount: number;
  couponDiscount: number;
  giftCardAmount: number;
  shipping: number;
  taxes: number;
  total: number;
  savings: number;
  itemCount: number;
};

export type RecommendedProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  badge?: string;
  badgeVariant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  brand: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
};

export const mockCartItems: CartItem[] = [
  {
    id: 'ci-1',
    productId: 'p001',
    name: 'Cerradura Inteligente Yale YRD256 WiFi',
    slug: 'cerradura-inteligente-yale-yrd256',
    sku: 'YRD-256-WF',
    brand: 'Yale',
    image: '/images/products/placeholder-800x800.jpg',
    variantLabel: 'Terminación',
    variantValue: 'Negro mate',
    price: 89999,
    originalPrice: 112999,
    discount: 20,
    quantity: 1,
    maxQuantity: 15,
    inStock: true,
    stockCount: 15,
  },
  {
    id: 'ci-2',
    productId: 'p002',
    name: 'Cámara IP Ezviz C8C Pro 4K',
    slug: 'camara-ip-ezviz-c8c-pro-4k',
    sku: 'C8C-PRO-4K',
    brand: 'Ezviz',
    image: '/images/products/placeholder-800x800.jpg',
    price: 45999,
    originalPrice: 57999,
    discount: 21,
    quantity: 2,
    maxQuantity: 23,
    inStock: true,
    stockCount: 23,
  },
  {
    id: 'ci-3',
    productId: 'p007',
    name: 'Router TP-Link Deco X50 AX3000',
    slug: 'router-tp-link-deco-x50',
    sku: 'DECO-X50',
    brand: 'TP-Link',
    image: '/images/products/placeholder-800x800.jpg',
    price: 75999,
    quantity: 1,
    maxQuantity: 31,
    inStock: true,
    stockCount: 31,
  },
  {
    id: 'ci-4',
    productId: 'p014',
    name: 'Lámpara Inteligente Philips Hue White',
    slug: 'lampara-inteligente-philips-hue',
    sku: 'PH-HUE-WHITE',
    brand: 'Philips',
    image: '/images/products/placeholder-800x800.jpg',
    variantLabel: 'Versión',
    variantValue: 'Pack 2 unidades',
    price: 12999,
    quantity: 3,
    maxQuantity: 67,
    inStock: true,
    stockCount: 67,
    badge: 'Más Vendido',
    badgeVariant: 'success',
  },
];

export const mockCoupons: { code: string; discount: number; type: 'percentage' | 'fixed'; label: string }[] = [
  { code: 'BIENVENIDO10', discount: 10, type: 'percentage', label: '10% de descuento' },
  { code: 'AHORRO5K', discount: 5000, type: 'fixed', label: '$5.000 de descuento' },
];

export const mockGiftCards: { code: string; amount: number }[] = [
  { code: 'GIFT-25K', amount: 25000 },
  { code: 'GIFT-50K', amount: 50000 },
];

export const shippingOptions: ShippingOption[] = [
  { id: 'std', method: 'Envío estándar', cost: 0, estimatedDays: '3-5 días hábiles', provider: 'Correo Argentino' },
  { id: 'exp', method: 'Envío express', cost: 7500, estimatedDays: '1-2 días hábiles', provider: 'OCA' },
  { id: 'priority', method: 'Envío prioritario', cost: 12000, estimatedDays: '24 horas', provider: 'Andreani' },
  { id: 'pickup', method: 'Retiro en sucursal', cost: 0, estimatedDays: 'Disponible en 2 horas', provider: 'Sucursal' },
];

export const recommendedProducts: RecommendedProduct[] = [
  { id: 'rp-1', name: 'Sensor de Puerta Samsung SmartThings', slug: 'sensor-puerta-samsung-smartthings', price: 15999, originalPrice: 19999, discount: 20, image: '/images/products/placeholder-800x800.jpg', badge: '20% OFF', badgeVariant: 'danger', brand: 'Samsung', inStock: true, rating: 4.1, reviewCount: 67 },
  { id: 'rp-2', name: 'Hub Samsung SmartThings V3', slug: 'hub-samsung-smartthings-v3', price: 35999, image: '/images/products/placeholder-800x800.jpg', brand: 'Samsung', inStock: true, rating: 4.0, reviewCount: 78 },
  { id: 'rp-3', name: 'Cerradura Inteligente Yale YL100 Zigbee', slug: 'cerradura-inteligente-yale-yl100', price: 74999, originalPrice: 89999, discount: 17, image: '/images/products/placeholder-800x800.jpg', badge: '17% OFF', badgeVariant: 'danger', brand: 'Yale', inStock: true, rating: 4.4, reviewCount: 92 },
  { id: 'rp-4', name: 'Kit Cámaras Hikvision 8CH 4K', slug: 'kit-camaras-hikvision-8ch-4k', price: 349999, originalPrice: 429999, discount: 19, image: '/images/products/placeholder-800x800.jpg', badge: '19% OFF', badgeVariant: 'danger', brand: 'Hikvision', inStock: true, rating: 4.6, reviewCount: 43 },
  { id: 'rp-5', name: 'Teclado Mecánico Logitech MX Mechanical', slug: 'teclado-mecanico-logitech-mx-mechanical', price: 45999, image: '/images/products/placeholder-800x800.jpg', badge: 'Más Vendido', badgeVariant: 'success', brand: 'Logitech', inStock: true, rating: 4.6, reviewCount: 312 },
  { id: 'rp-6', name: 'SSD Samsung 990 Pro 2TB', slug: 'ssd-samsung-990-pro-2tb', price: 149999, originalPrice: 189999, discount: 21, image: '/images/products/placeholder-800x800.jpg', badge: '21% OFF', badgeVariant: 'danger', brand: 'Samsung', inStock: true, rating: 4.9, reviewCount: 523 },
];

export const defaultCartSummary: CartSummary = {
  subtotal: 231995,
  discount: 52000,
  couponDiscount: 0,
  giftCardAmount: 0,
  shipping: 0,
  taxes: 0,
  total: 231995,
  savings: 52000,
  itemCount: 7,
};
