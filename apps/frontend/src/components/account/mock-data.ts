export type OrderStatus = 'confirmed' | 'preparing' | 'shipped' | 'transit' | 'delivered' | 'cancelled';

export type TimelineEvent = {
  status: OrderStatus;
  date: string;
  label: string;
  description: string;
};

export type AccountOrder = {
  id: string;
  number: string;
  date: string;
  status: OrderStatus;
  items: { name: string; quantity: number; price: number; image: string }[];
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  paymentMethod: string;
  shippingMethod: string;
  estimatedDelivery: string;
  trackingNumber?: string;
  timeline: TimelineEvent[];
  invoiceUrl?: string;
  deliveryAddress: string;
};

export type AccountAddress = {
  id: string;
  type: 'home' | 'work' | 'branch';
  street: string;
  number: string;
  floor?: string;
  apartment?: string;
  city: string;
  province: string;
  postalCode: string;
  reference?: string;
  isDefault: boolean;
  recipient: string;
  phone: string;
};

export type AccountFavorite = {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  badge?: string;
  inStock: boolean;
  brand: string;
  rating: number;
  reviewCount: number;
};

export type AccountReview = {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
};

export type SupportTicket = {
  id: string;
  number: string;
  subject: string;
  category: string;
  status: 'open' | 'answered' | 'closed';
  priority: 'low' | 'medium' | 'high';
  lastUpdate: string;
  createdAt: string;
};

export type Warranty = {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  sku: string;
  image: string;
  purchaseDate: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expiring' | 'expired';
  remainingDays: number;
};

export type DashboardStats = {
  totalOrders: number;
  pendingOrders: number;
  favoritesCount: number;
  activeWarranties: number;
  openTickets: number;
};

export const accountUser = {
  id: 'u-1',
  firstName: 'Juan',
  lastName: 'Pérez',
  email: 'juan.perez@ejemplo.com',
  phone: '1155551234',
  documentType: 'DNI',
  documentNumber: '30.123.456',
  avatar: undefined,
  createdAt: '2025-03-15',
  lastLogin: '2026-07-28',
};

export const dashboardStats: DashboardStats = {
  totalOrders: 12,
  pendingOrders: 2,
  favoritesCount: 8,
  activeWarranties: 4,
  openTickets: 1,
};

const placeholderImg = '/images/products/placeholder-800x800.jpg';

function makeTimeline(status: OrderStatus, date: string): TimelineEvent[] {
  const base = [
    { status: 'confirmed' as const, date: date, label: 'Pedido recibido', description: 'Recibimos tu pedido correctamente' },
    { status: 'preparing' as const, date: date, label: 'Preparando pedido', description: 'Estamos preparando tus productos' },
    { status: 'shipped' as const, date: date, label: 'Despachado', description: 'El pedido fue despachado' },
    { status: 'transit' as const, date: date, label: 'En camino', description: 'El pedido está en ruta' },
    { status: 'delivered' as const, date: date, label: 'Entregado', description: 'Pedido entregado con éxito' },
  ];
  const idx = base.findIndex((e) => e.status === status);
  if (idx === -1) return [];
  return base.slice(0, idx + 1).map((e, i) => {
    const d = new Date(new Date(date).getTime() + i * 86400000).toISOString().split('T')[0];
    return {
      status: e.status,
      label: e.label,
      description: e.description,
      date: d ?? date,
    };
  });
}

export const accountOrders: AccountOrder[] = [
  { id: 'o-1', number: 'ORD-2026-0004582', date: '2026-07-25', status: 'transit', items: [
    { name: 'Cerradura Inteligente Yale YRD256 WiFi', quantity: 1, price: 89999, image: placeholderImg },
    { name: 'Cámara IP Ezviz C8C Pro 4K', quantity: 2, price: 45999, image: placeholderImg },
  ], total: 231995, subtotal: 231995, shipping: 0, discount: 52000, paymentMethod: 'Tarjeta de crédito (12 cuotas)', shippingMethod: 'Envío estándar', estimatedDelivery: '28-30 jul', trackingNumber: 'AR123456789ARG', timeline: makeTimeline('transit', '2026-07-25'), deliveryAddress: 'Av. 7 1234, La Plata, Buenos Aires' },
  { id: 'o-2', number: 'ORD-2026-0004510', date: '2026-07-20', status: 'delivered', items: [
    { name: 'Router TP-Link Deco X50 AX3000', quantity: 1, price: 75999, image: placeholderImg },
  ], total: 75999, subtotal: 75999, shipping: 0, discount: 0, paymentMethod: 'Mercado Pago', shippingMethod: 'Envío express', estimatedDelivery: '22 jul', timeline: makeTimeline('delivered', '2026-07-20'), deliveryAddress: 'Av. 7 1234, La Plata, Buenos Aires' },
  { id: 'o-3', number: 'ORD-2026-0004438', date: '2026-07-10', status: 'delivered', items: [
    { name: 'Lámpara Inteligente Philips Hue White', quantity: 2, price: 12999, image: placeholderImg },
    { name: 'Sensor de Movimiento Intelbras IVP 7000', quantity: 1, price: 18999, image: placeholderImg },
  ], total: 44997, subtotal: 44997, shipping: 0, discount: 0, paymentMethod: 'Transferencia bancaria', shippingMethod: 'Envío estándar', estimatedDelivery: '14 jul', timeline: makeTimeline('delivered', '2026-07-10'), deliveryAddress: 'Av. 7 1234, La Plata, Buenos Aires' },
  { id: 'o-4', number: 'ORD-2026-0004301', date: '2026-06-28', status: 'cancelled', items: [
    { name: 'Kit Cámaras Hikvision 8CH 4K', quantity: 1, price: 349999, image: placeholderImg },
  ], total: 349999, subtotal: 349999, shipping: 7500, discount: 0, paymentMethod: 'Tarjeta de débito', shippingMethod: 'Envío express', estimatedDelivery: '-', timeline: [
    { status: 'confirmed', date: '2026-06-28', label: 'Pedido recibido', description: 'Recibimos tu pedido' },
    { status: 'cancelled', date: '2026-06-29', label: 'Cancelado', description: 'Cancelado por solicitud del cliente' },
  ], deliveryAddress: 'Av. 7 1234, La Plata, Buenos Aires' },
  { id: 'o-5', number: 'ORD-2026-0004205', date: '2026-06-15', status: 'delivered', items: [
    { name: 'Cerradura Inteligente Yale YL100 Zigbee', quantity: 1, price: 74999, image: placeholderImg },
    { name: 'Hub Samsung SmartThings V3', quantity: 1, price: 35999, image: placeholderImg },
  ], total: 110998, subtotal: 110998, shipping: 0, discount: 0, paymentMethod: 'MODO', shippingMethod: 'Envío estándar', estimatedDelivery: '18 jun', timeline: makeTimeline('delivered', '2026-06-15'), invoiceUrl: '#', deliveryAddress: 'Av. 7 1234, La Plata, Buenos Aires' },
  { id: 'o-6', number: 'ORD-2026-0004102', date: '2026-06-01', status: 'confirmed', items: [
    { name: 'Videoportero IP Intelbras AMT 8000', quantity: 1, price: 125999, image: placeholderImg },
  ], total: 125999, subtotal: 125999, shipping: 0, discount: 0, paymentMethod: 'Tarjeta de crédito (3 cuotas)', shippingMethod: 'Envío estándar', estimatedDelivery: '4-6 jun', timeline: makeTimeline('confirmed', '2026-06-01'), deliveryAddress: 'Av. 7 1234, La Plata, Buenos Aires' },
];

export const accountAddresses: AccountAddress[] = [
  { id: 'a-1', type: 'home', street: 'Av. 7', number: '1234', floor: '3', apartment: 'B', city: 'La Plata', province: 'Buenos Aires', postalCode: '1900', reference: 'Edificio blanco, timbre 3', isDefault: true, recipient: 'Juan Pérez', phone: '1155551234' },
  { id: 'a-2', type: 'work', street: 'Av. Corrientes', number: '2560', floor: '5', city: 'CABA', province: 'CABA', postalCode: '1046', isDefault: false, recipient: 'Juan Pérez', phone: '1155551234' },
  { id: 'a-3', type: 'branch', street: 'Av. Libertador', number: '7890', city: 'Mar del Plata', province: 'Buenos Aires', postalCode: '7600', isDefault: false, recipient: 'Sucursal Mar del Plata', phone: '2235556789' },
];

export const accountFavorites: AccountFavorite[] = [
  { id: 'f-1', productId: 'p006', name: 'Cámara PTZ Hikvision 5MP', slug: 'camara-ptz-hikvision-5mp', price: 215999, originalPrice: 269999, discount: 20, image: placeholderImg, badge: '20% OFF', inStock: true, brand: 'Hikvision', rating: 4.8, reviewCount: 112 },
  { id: 'f-2', productId: 'p021', name: 'Teclado Mecánico Logitech MX Mechanical', slug: 'teclado-mecanico-logitech-mx-mechanical', price: 45999, image: placeholderImg, badge: 'Más Vendido', inStock: true, brand: 'Logitech', rating: 4.6, reviewCount: 312 },
  { id: 'f-3', productId: 'p025', name: 'SSD Samsung 990 Pro 2TB', slug: 'ssd-samsung-990-pro-2tb', price: 149999, originalPrice: 189999, discount: 21, image: placeholderImg, badge: '21% OFF', inStock: true, brand: 'Samsung', rating: 4.9, reviewCount: 523 },
  { id: 'f-4', productId: 'p024', name: 'Monitor Samsung Odyssey G7 27"', slug: 'monitor-samsung-odyssey-g7-27', price: 189999, image: placeholderImg, badge: 'Nuevo', inStock: true, brand: 'Samsung', rating: 4.8, reviewCount: 267 },
  { id: 'f-5', productId: 'p005', name: 'Control de Acceso Biométrico Dahua', slug: 'control-acceso-biometrico-dahua', price: 189999, image: placeholderImg, inStock: true, brand: 'Dahua', rating: 4.6, reviewCount: 34 },
  { id: 'f-6', productId: 'p012', name: 'Kit Cámaras Hikvision 8CH 4K', slug: 'kit-camaras-hikvision-8ch-4k', price: 349999, originalPrice: 429999, discount: 19, image: placeholderImg, badge: '19% OFF', inStock: false, brand: 'Hikvision', rating: 4.6, reviewCount: 43 },
];

export const accountReviews: AccountReview[] = [
  { id: 'r-1', productId: 'p001', productName: 'Cerradura Inteligente Yale YRD256 WiFi', productImage: placeholderImg, rating: 5, comment: 'Excelente producto. La instalación fue muy sencilla y la app funciona genial.', date: '2026-07-26', status: 'approved' },
  { id: 'r-2', productId: 'p002', productName: 'Cámara IP Ezviz C8C Pro 4K', productImage: placeholderImg, rating: 4, comment: 'Muy buena calidad de imagen. La app es fácil de usar.', date: '2026-07-22', status: 'approved' },
  { id: 'r-3', productId: 'p007', productName: 'Router TP-Link Deco X50 AX3000', productImage: placeholderImg, rating: 5, comment: 'Cobertura excelente en toda la casa. Lo recomiendo.', date: '2026-07-21', status: 'approved' },
  { id: 'r-4', productId: 'p014', productName: 'Lámpara Inteligente Philips Hue White', productImage: placeholderImg, rating: 3, comment: 'Buena calidad pero un poco cara para lo que ofrece.', date: '2026-07-15', status: 'pending' },
];

export const supportTickets: SupportTicket[] = [
  { id: 't-1', number: 'TKT-2026-0892', subject: 'Problema con conexión WiFi de cerradura Yale', category: 'Soporte técnico', status: 'answered', priority: 'high', lastUpdate: '2026-07-27', createdAt: '2026-07-25' },
  { id: 't-2', number: 'TKT-2026-0875', subject: 'Consulta sobre garantía de cámara Ezviz', category: 'Garantías', status: 'answered', priority: 'medium', lastUpdate: '2026-07-20', createdAt: '2026-07-18' },
  { id: 't-3', number: 'TKT-2026-0850', subject: 'Solicito factura A del pedido ORD-2026-0004438', category: 'Facturación', status: 'closed', priority: 'low', lastUpdate: '2026-07-12', createdAt: '2026-07-10' },
  { id: 't-4', number: 'TKT-2026-0901', subject: 'Router TP-Link no enciende después de actualización', category: 'Soporte técnico', status: 'open', priority: 'high', lastUpdate: '2026-07-28', createdAt: '2026-07-28' },
];

export const warranties: Warranty[] = [
  { id: 'w-1', productId: 'p001', productName: 'Cerradura Inteligente Yale YRD256 WiFi', productSlug: 'cerradura-inteligente-yale-yrd256', sku: 'YRD-256-WF', image: placeholderImg, purchaseDate: '2026-07-25', startDate: '2026-07-25', endDate: '2028-07-25', status: 'active', remainingDays: 727 },
  { id: 'w-2', productId: 'p002', productName: 'Cámara IP Ezviz C8C Pro 4K', productSlug: 'camara-ip-ezviz-c8c-pro-4k', sku: 'C8C-PRO-4K', image: placeholderImg, purchaseDate: '2026-07-20', startDate: '2026-07-20', endDate: '2027-07-20', status: 'active', remainingDays: 356 },
  { id: 'w-3', productId: 'p007', productName: 'Router TP-Link Deco X50 AX3000', productSlug: 'router-tp-link-deco-x50', sku: 'DECO-X50', image: placeholderImg, purchaseDate: '2026-07-20', startDate: '2026-07-20', endDate: '2027-07-20', status: 'active', remainingDays: 356 },
  { id: 'w-4', productId: 'p014', productName: 'Lámpara Inteligente Philips Hue White', productSlug: 'lampara-inteligente-philips-hue', sku: 'PH-HUE-WHITE', image: placeholderImg, purchaseDate: '2026-07-10', startDate: '2026-07-10', endDate: '2027-07-10', status: 'active', remainingDays: 346 },
  { id: 'w-5', productId: 'p003', productName: 'Videoportero IP Intelbras AMT 8000', productSlug: 'videoportero-ip-intelbras-amt-8000', sku: 'AMT-8000-IP', image: placeholderImg, purchaseDate: '2026-06-01', startDate: '2026-06-01', endDate: '2027-06-01', status: 'expiring', remainingDays: 307 },
];

export const statusLabels: Record<string, string> = {
  confirmed: 'Confirmado', preparing: 'Preparando', shipped: 'Despachado',
  transit: 'En camino', delivered: 'Entregado', cancelled: 'Cancelado',
  open: 'Abierto', answered: 'Respondido', closed: 'Cerrado',
  active: 'Activa', expiring: 'Por vencer', expired: 'Vencida',
  approved: 'Aprobada', pending: 'Pendiente', rejected: 'Rechazada',
  high: 'Alta', medium: 'Media', low: 'Baja',
  home: 'Casa', work: 'Trabajo', branch: 'Sucursal',
};
