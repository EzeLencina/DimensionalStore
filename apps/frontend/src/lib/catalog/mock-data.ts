export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  subcategorySlug: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  badge?: string;
  badgeVariant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  estimatedDelivery: string;
  warranty: string;
  specs: Record<string, string>;
};

export type CatalogCategory = {
  id: string;
  name: string;
  slug: string;
  href: string;
  count: number;
  children?: { id: string; name: string; slug: string; href: string; count: number }[];
};

export type FilterValue = {
  value: string;
  label: string;
  count: number;
};

export type FilterDefinition = {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range' | 'rating';
  key: string;
  options?: FilterValue[];
  min?: number;
  max?: number;
};

export type SortOption = {
  value: string;
  label: string;
};

export type CatalogState = {
  products: CatalogProduct[];
  total: number;
  page: number;
  pageSize: number;
  sort: string;
  viewMode: 'grid' | 'list';
  filters: Record<string, string | string[] | [number, number]>;
};

export const catalogCategories: CatalogCategory[] = [
  { id: 'c1', name: 'Cerraduras Inteligentes', slug: 'cerraduras-inteligentes', href: '/categoria/cerraduras-inteligentes', count: 48, children: [
    { id: 'c1a', name: 'Conectividad WiFi', slug: 'wifi', href: '/categoria/cerraduras-inteligentes/wifi', count: 18 },
    { id: 'c1b', name: 'Conectividad Bluetooth', slug: 'bluetooth', href: '/categoria/cerraduras-inteligentes/bluetooth', count: 12 },
    { id: 'c1c', name: 'Conectividad Zigbee', slug: 'zigbee', href: '/categoria/cerraduras-inteligentes/zigbee', count: 10 },
    { id: 'c1d', name: 'Acceso Remoto', slug: 'acceso-remoto', href: '/categoria/cerraduras-inteligentes/acceso-remoto', count: 8 },
  ]},
  { id: 'c2', name: 'Cámaras de Seguridad', slug: 'camaras-seguridad', href: '/categoria/camaras-seguridad', count: 72, children: [
    { id: 'c2a', name: 'Interior', slug: 'interior', href: '/categoria/camaras-seguridad/interior', count: 28 },
    { id: 'c2b', name: 'Exterior', slug: 'exterior', href: '/categoria/camaras-seguridad/exterior', count: 24 },
    { id: 'c2c', name: 'PTZ', slug: 'ptz', href: '/categoria/camaras-seguridad/ptz', count: 12 },
    { id: 'c2d', name: 'Inalámbricas', slug: 'inalambricas', href: '/categoria/camaras-seguridad/inalambricas', count: 8 },
  ]},
  { id: 'c3', name: 'Videoporteros', slug: 'videoporteros', href: '/categoria/videoporteros', count: 24 },
  { id: 'c4', name: 'Control de Acceso', slug: 'control-acceso', href: '/categoria/control-acceso', count: 36 },
  { id: 'c5', name: 'Domótica', slug: 'domotica', href: '/categoria/domotica', count: 56 },
  { id: 'c6', name: 'Accesorios', slug: 'accesorios', href: '/categoria/accesorios', count: 89 },
];

export const catalogBrands: FilterValue[] = [
  { value: 'yale', label: 'Yale', count: 24 },
  { value: 'philips', label: 'Philips', count: 18 },
  { value: 'samsung', label: 'Samsung', count: 32 },
  { value: 'intelbras', label: 'Intelbras', count: 28 },
  { value: 'ezviz', label: 'Ezviz', count: 22 },
  { value: 'dahua', label: 'Dahua', count: 16 },
  { value: 'hikvision', label: 'Hikvision', count: 20 },
  { value: 'tp-link', label: 'TP-Link', count: 35 },
  { value: 'logitech', label: 'Logitech', count: 14 },
  { value: 'razer', label: 'Razer', count: 8 },
];

export const filterDefinitions: FilterDefinition[] = [
  {
    id: 'category',
    label: 'Categoría',
    type: 'checkbox',
    key: 'category',
    options: catalogCategories.map((c) => ({ value: c.slug, label: c.name, count: c.count })),
  },
  {
    id: 'brand',
    label: 'Marca',
    type: 'checkbox',
    key: 'brand',
    options: catalogBrands,
  },
  {
    id: 'price',
    label: 'Precio',
    type: 'range',
    key: 'price',
    min: 0,
    max: 500000,
  },
  {
    id: 'discount',
    label: 'Descuento',
    type: 'checkbox',
    key: 'discount',
    options: [
      { value: '10', label: '10% o más', count: 45 },
      { value: '20', label: '20% o más', count: 32 },
      { value: '30', label: '30% o más', count: 18 },
      { value: '50', label: '50% o más', count: 6 },
    ],
  },
  {
    id: 'rating',
    label: 'Valoración',
    type: 'rating',
    key: 'rating',
    options: [
      { value: '4', label: '4 estrellas o más', count: 89 },
      { value: '3', label: '3 estrellas o más', count: 142 },
      { value: '2', label: '2 estrellas o más', count: 168 },
    ],
  },
  {
    id: 'availability',
    label: 'Disponibilidad',
    type: 'checkbox',
    key: 'availability',
    options: [
      { value: 'in-stock', label: 'En stock', count: 145 },
      { value: 'out-of-stock', label: 'Sin stock', count: 35 },
      { value: 'on-sale', label: 'En oferta', count: 52 },
    ],
  },
];

export const sortOptions: SortOption[] = [
  { value: 'relevance', label: 'Más relevantes' },
  { value: 'best-sellers', label: 'Más vendidos' },
  { value: 'price-asc', label: 'Menor precio' },
  { value: 'price-desc', label: 'Mayor precio' },
  { value: 'discount', label: 'Mayor descuento' },
  { value: 'newest', label: 'Novedades' },
  { value: 'rating', label: 'Mejor valorados' },
];

function makeProduct(
  id: string,
  overrides: Partial<CatalogProduct>,
): CatalogProduct {
  const defaults = {
    id,
    name: 'Producto',
    slug: 'producto',
    sku: `SKU-${id}`,
    brand: 'Yale',
    brandSlug: 'yale',
    category: 'Cerraduras Inteligentes',
    categorySlug: 'cerraduras-inteligentes',
    subcategory: 'WiFi',
    subcategorySlug: 'wifi',
    price: 59999,
    rating: 4.0,
    reviewCount: 0,
    image: '/images/products/placeholder.jpg',
    images: [],
    inStock: true,
    stockCount: 10,
    estimatedDelivery: '24 horas',
    warranty: '12 meses',
    specs: {},
  };
  return { ...defaults, ...overrides };
}

export const catalogProducts: CatalogProduct[] = [
  makeProduct('p001', { name: 'Cerradura Inteligente Yale YRD256 WiFi', slug: 'cerradura-inteligente-yale-yrd256', sku: 'YRD-256-WF', brand: 'Yale', brandSlug: 'yale', category: 'Cerraduras Inteligentes', categorySlug: 'cerraduras-inteligentes', subcategory: 'WiFi', subcategorySlug: 'wifi', price: 89999, originalPrice: 112999, discount: 20, rating: 4.5, reviewCount: 128, badge: '20% OFF', badgeVariant: 'danger', stockCount: 15, estimatedDelivery: '24 horas', warranty: '24 meses', specs: { Conectividad: 'WiFi + Bluetooth', 'Tipo': 'Digital', Material: 'Acero' } }),
  makeProduct('p002', { name: 'Cámara IP Ezviz C8C Pro 4K', slug: 'camara-ip-ezviz-c8c-pro-4k', sku: 'C8C-PRO-4K', brand: 'Ezviz', brandSlug: 'ezviz', category: 'Cámaras de Seguridad', categorySlug: 'camaras-seguridad', subcategory: 'Exterior', subcategorySlug: 'exterior', price: 45999, originalPrice: 57999, discount: 21, rating: 4.7, reviewCount: 89, badge: '21% OFF', badgeVariant: 'danger', stockCount: 23, estimatedDelivery: '48 horas', warranty: '12 meses', specs: { Resolución: '4K Ultra HD', VisiónNocturna: 'Sí' } }),
  makeProduct('p003', { name: 'Videoportero IP Intelbras AMT 8000', slug: 'videoportero-ip-intelbras-amt-8000', sku: 'AMT-8000-IP', brand: 'Intelbras', brandSlug: 'intelbras', category: 'Videoporteros', categorySlug: 'videoporteros', subcategory: 'IP', subcategorySlug: 'ip', price: 125999, rating: 4.3, reviewCount: 45, badge: 'Nuevo', badgeVariant: 'info', stockCount: 8, estimatedDelivery: '48 horas', warranty: '12 meses' }),
  makeProduct('p004', { name: 'Sensor de Puerta Samsung SmartThings', slug: 'sensor-puerta-samsung-smartthings', sku: 'STS-MGT-001', brand: 'Samsung', brandSlug: 'samsung', category: 'Domótica', categorySlug: 'domotica', subcategory: 'Sensores', subcategorySlug: 'sensores', price: 15999, originalPrice: 19999, discount: 20, rating: 4.1, reviewCount: 67, badge: '20% OFF', badgeVariant: 'danger', stockCount: 42, estimatedDelivery: '24 horas', warranty: '6 meses' }),
  makeProduct('p005', { name: 'Control de Acceso Biométrico Dahua', slug: 'control-acceso-biometrico-dahua', sku: 'DHI-AS7210', brand: 'Dahua', brandSlug: 'dahua', category: 'Control de Acceso', categorySlug: 'control-acceso', subcategory: 'Biométrico', subcategorySlug: 'biometrico', price: 189999, rating: 4.6, reviewCount: 34, stockCount: 5, estimatedDelivery: '72 horas', warranty: '24 meses', specs: { 'Tipo': 'Biométrico', Capacidad: '10,000 huellas' } }),
  makeProduct('p006', { name: 'Cámara PTZ Hikvision 5MP', slug: 'camara-ptz-hikvision-5mp', sku: 'DS-2DE5225IW-AE', brand: 'Hikvision', brandSlug: 'hikvision', category: 'Cámaras de Seguridad', categorySlug: 'camaras-seguridad', subcategory: 'PTZ', subcategorySlug: 'ptz', price: 215999, originalPrice: 269999, discount: 20, rating: 4.8, reviewCount: 112, badge: 'Más Vendido', badgeVariant: 'success', stockCount: 11, estimatedDelivery: '48 horas', warranty: '24 meses' }),
  makeProduct('p007', { name: 'Router TP-Link Deco X50 AX3000', slug: 'router-tp-link-deco-x50', sku: 'DECO-X50', brand: 'TP-Link', brandSlug: 'tp-link', category: 'Accesorios', categorySlug: 'accesorios', subcategory: 'Redes', subcategorySlug: 'redes', price: 75999, rating: 4.4, reviewCount: 203, badge: 'Nuevo', badgeVariant: 'info', stockCount: 31, isNew: true, estimatedDelivery: '24 horas', warranty: '12 meses' }),
  makeProduct('p008', { name: 'Cerradura Inteligente Philips Gamma WiFi', slug: 'cerradura-inteligente-philips-gamma', sku: 'PH-GAMMA-SL', brand: 'Philips', brandSlug: 'philips', category: 'Cerraduras Inteligentes', categorySlug: 'cerraduras-inteligentes', subcategory: 'WiFi', subcategorySlug: 'wifi', price: 64999, originalPrice: 84999, discount: 24, rating: 4.2, reviewCount: 56, badge: '24% OFF', badgeVariant: 'danger', stockCount: 19, estimatedDelivery: '24 horas', warranty: '12 meses' }),
  makeProduct('p009', { name: 'Cámara Interior Ezviz C6N 2K', slug: 'camara-interior-ezviz-c6n-2k', sku: 'C6N-2K', brand: 'Ezviz', brandSlug: 'ezviz', category: 'Cámaras de Seguridad', categorySlug: 'camaras-seguridad', subcategory: 'Interior', subcategorySlug: 'interior', price: 28999, rating: 4.3, reviewCount: 156, stockCount: 45, estimatedDelivery: '24 horas', warranty: '12 meses' }),
  makeProduct('p010', { name: 'Hub Samsung SmartThings V3', slug: 'hub-samsung-smartthings-v3', sku: 'STS-HUB-003', brand: 'Samsung', brandSlug: 'samsung', category: 'Domótica', categorySlug: 'domotica', subcategory: 'Hubs', subcategorySlug: 'hubs', price: 35999, rating: 4.0, reviewCount: 78, stockCount: 22, estimatedDelivery: '48 horas', warranty: '12 meses' }),
  makeProduct('p011', { name: 'Cerradura Inteligente Yale YL100 Zigbee', slug: 'cerradura-inteligente-yale-yl100', sku: 'YL-100-ZB', brand: 'Yale', brandSlug: 'yale', category: 'Cerraduras Inteligentes', categorySlug: 'cerraduras-inteligentes', subcategory: 'Zigbee', subcategorySlug: 'zigbee', price: 74999, originalPrice: 89999, discount: 17, rating: 4.4, reviewCount: 92, badge: '17% OFF', badgeVariant: 'danger', stockCount: 13, estimatedDelivery: '24 horas', warranty: '24 meses' }),
  makeProduct('p012', { name: 'Kit Cámaras Hikvision 8CH 4K', slug: 'kit-camaras-hikvision-8ch-4k', sku: 'DS-8CH-4K', brand: 'Hikvision', brandSlug: 'hikvision', category: 'Cámaras de Seguridad', categorySlug: 'camaras-seguridad', subcategory: 'Kits', subcategorySlug: 'kits', price: 349999, originalPrice: 429999, discount: 19, rating: 4.6, reviewCount: 43, badge: '19% OFF', badgeVariant: 'danger', stockCount: 4, estimatedDelivery: '72 horas', warranty: '24 meses' }),
  makeProduct('p013', { name: 'Videoportero Dahua VTO2201F', slug: 'videoportero-dahua-vto2201f', sku: 'VTO2201F', brand: 'Dahua', brandSlug: 'dahua', category: 'Videoporteros', categorySlug: 'videoporteros', subcategory: 'IP', subcategorySlug: 'ip', price: 85999, rating: 4.2, reviewCount: 29, stockCount: 7, estimatedDelivery: '48 horas', warranty: '12 meses' }),
  makeProduct('p014', { name: 'Lámpara Inteligente Philips Hue White', slug: 'lampara-inteligente-philips-hue', sku: 'PH-HUE-WHITE', brand: 'Philips', brandSlug: 'philips', category: 'Domótica', categorySlug: 'domotica', subcategory: 'Iluminación', subcategorySlug: 'iluminacion', price: 12999, rating: 4.5, reviewCount: 234, badge: 'Más Vendido', badgeVariant: 'success', stockCount: 67, estimatedDelivery: '24 horas', warranty: '12 meses' }),
  makeProduct('p015', { name: 'Sensor de Movimiento Intelbras IVP 7000', slug: 'sensor-movimiento-intelbras-ivp-7000', sku: 'IVP-7000', brand: 'Intelbras', brandSlug: 'intelbras', category: 'Domótica', categorySlug: 'domotica', subcategory: 'Sensores', subcategorySlug: 'sensores', price: 18999, rating: 3.9, reviewCount: 41, stockCount: 33, estimatedDelivery: '48 horas', warranty: '12 meses' }),
  makeProduct('p016', { name: 'Control de Acceso Yale Conexis L2', slug: 'control-acceso-yale-conexis-l2', sku: 'CONEXIS-L2', brand: 'Yale', brandSlug: 'yale', category: 'Control de Acceso', categorySlug: 'control-acceso', subcategory: 'Electrónico', subcategorySlug: 'electronico', price: 139999, rating: 4.3, reviewCount: 18, stockCount: 6, estimatedDelivery: '72 horas', warranty: '24 meses' }),
  makeProduct('p017', { name: 'Cámara Exterior TP-Link Tapo C320WS', slug: 'camara-exterior-tp-link-tapo-c320ws', sku: 'TAPO-C320WS', brand: 'TP-Link', brandSlug: 'tp-link', category: 'Cámaras de Seguridad', categorySlug: 'camaras-seguridad', subcategory: 'Exterior', subcategorySlug: 'exterior', price: 25999, originalPrice: 31999, discount: 19, rating: 4.2, reviewCount: 189, badge: '19% OFF', badgeVariant: 'danger', stockCount: 55, estimatedDelivery: '24 horas', warranty: '12 meses' }),
  makeProduct('p018', { name: 'Cerradura Inteligente Samsung SHS-P710', slug: 'cerradura-inteligente-samsung-shs-p710', sku: 'SHS-P710', brand: 'Samsung', brandSlug: 'samsung', category: 'Cerraduras Inteligentes', categorySlug: 'cerraduras-inteligentes', subcategory: 'Bluetooth', subcategorySlug: 'bluetooth', price: 95999, rating: 4.1, reviewCount: 37, stockCount: 9, estimatedDelivery: '48 horas', warranty: '12 meses' }),
  makeProduct('p019', { name: 'NVR Dahua 16 Canales 4K', slug: 'nvr-dahua-16-canales-4k', sku: 'DHI-NVR16-4K', brand: 'Dahua', brandSlug: 'dahua', category: 'Cámaras de Seguridad', categorySlug: 'camaras-seguridad', subcategory: 'NVR', subcategorySlug: 'nvr', price: 279999, rating: 4.7, reviewCount: 22, stockCount: 3, estimatedDelivery: '72 horas', warranty: '24 meses' }),
  makeProduct('p020', { name: 'Kit Domótica Intelbras Smart Home', slug: 'kit-domotica-intelbras-smart-home', sku: 'SMART-HOME-KIT', brand: 'Intelbras', brandSlug: 'intelbras', category: 'Domótica', categorySlug: 'domotica', subcategory: 'Kits', subcategorySlug: 'kits', price: 84999, originalPrice: 104999, discount: 19, rating: 4.0, reviewCount: 15, badge: '19% OFF', badgeVariant: 'danger', stockCount: 11, estimatedDelivery: '48 horas', warranty: '12 meses' }),
  makeProduct('p021', { name: 'Teclado Mecánico Logitech MX Mechanical', slug: 'teclado-mecanico-logitech-mx-mechanical', sku: 'MX-MECH', brand: 'Logitech', brandSlug: 'logitech', category: 'Accesorios', categorySlug: 'accesorios', subcategory: 'Teclados', subcategorySlug: 'teclados', price: 45999, rating: 4.6, reviewCount: 312, badge: 'Más Vendido', badgeVariant: 'success', stockCount: 28, estimatedDelivery: '24 horas', warranty: '24 meses' }),
  makeProduct('p022', { name: 'Mouse Inalámbrico Logitech MX Master 3S', slug: 'mouse-inalambrico-logitech-mx-master-3s', sku: 'MX-MASTER-3S', brand: 'Logitech', brandSlug: 'logitech', category: 'Accesorios', categorySlug: 'accesorios', subcategory: 'Mouse', subcategorySlug: 'mouse', price: 38999, originalPrice: 45999, discount: 15, rating: 4.7, reviewCount: 445, badge: '15% OFF', badgeVariant: 'danger', stockCount: 36, estimatedDelivery: '24 horas', warranty: '24 meses' }),
  makeProduct('p023', { name: 'Auriculares Razer Kraken V3 Pro', slug: 'auriculares-razer-kraken-v3-pro', sku: 'KRAKEN-V3-PRO', brand: 'Razer', brandSlug: 'razer', category: 'Accesorios', categorySlug: 'accesorios', subcategory: 'Auriculares', subcategorySlug: 'auriculares', price: 52999, originalPrice: 67999, discount: 22, rating: 4.4, reviewCount: 178, badge: '22% OFF', badgeVariant: 'danger', stockCount: 14, estimatedDelivery: '48 horas', warranty: '12 meses' }),
  makeProduct('p024', { name: 'Monitor Samsung Odyssey G7 27"', slug: 'monitor-samsung-odyssey-g7-27', sku: 'ODYS-G7-27', brand: 'Samsung', brandSlug: 'samsung', category: 'Accesorios', categorySlug: 'accesorios', subcategory: 'Monitores', subcategorySlug: 'monitores', price: 189999, rating: 4.8, reviewCount: 267, badge: 'Nuevo', badgeVariant: 'info', stockCount: 9, isNew: true, estimatedDelivery: '48 horas', warranty: '24 meses' }),
  makeProduct('p025', { name: 'SSD Samsung 990 Pro 2TB', slug: 'ssd-samsung-990-pro-2tb', sku: 'SSD-990PRO-2TB', brand: 'Samsung', brandSlug: 'samsung', category: 'Accesorios', categorySlug: 'accesorios', subcategory: 'Almacenamiento', subcategorySlug: 'almacenamiento', price: 149999, originalPrice: 189999, discount: 21, rating: 4.9, reviewCount: 523, badge: '21% OFF', badgeVariant: 'danger', stockCount: 21, estimatedDelivery: '24 horas', warranty: '60 meses' }),
  makeProduct('p026', { name: 'Cargador Samsung 45W Super Fast', slug: 'cargador-samsung-45w-super-fast', sku: 'SAMS-45W-C', brand: 'Samsung', brandSlug: 'samsung', category: 'Accesorios', categorySlug: 'accesorios', subcategory: 'Cargadores', subcategorySlug: 'cargadores', price: 14999, rating: 4.0, reviewCount: 89, stockCount: 78, estimatedDelivery: '24 horas', warranty: '6 meses' }),
];
