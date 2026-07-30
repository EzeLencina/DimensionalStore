export type ProductImage = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ProductVideo = {
  id: string;
  src: string;
  thumbnail: string;
  type: 'youtube' | 'vimeo' | 'mp4';
};

export type ProductVariant = {
  id: string;
  type: 'color' | 'finish' | 'version' | 'kit' | 'capacity' | 'model';
  label: string;
  value: string;
  available: boolean;
  image?: string;
};

export type ProductReview = {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  likes: number;
  images?: string[];
};

export type ProductQuestion = {
  id: string;
  author: string;
  date: string;
  question: string;
  answer?: string;
  answerDate?: string;
  likes: number;
};

export type ShippingOption = {
  method: string;
  cost: number;
  estimatedDays: string;
};

export type PDPProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  brandSlug: string;
  model: string;
  internalCode: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  subcategorySlug: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  savings?: number;
  installments: { count: number; interest: boolean; installmentPrice: number }[];
  images: ProductImage[];
  videos: ProductVideo[];
  status: 'active' | 'draft' | 'discontinued';
  inStock: boolean;
  stockCount: number;
  isNew: boolean;
  isFeatured: boolean;
  badge?: string;
  badgeVariant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  estimatedDelivery: string;
  shipping: ShippingOption[];
  warranty: string;
  variants: ProductVariant[];
  shortDescription: string;
  description: string;
  features: string[];
  benefits: string[];
  boxContents: string[];
  installation: string;
  documentation: { label: string; url: string }[];
  specs: Record<string, string>;
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  questions: ProductQuestion[];
  relatedSlugs: string[];
  crossSellSlugs: string[];
};

function placeholderImg(width: number, height: number): string {
  return `/images/products/placeholder-${width}x${height}.jpg`;
}

function makeImage(id: string, alt: string, width = 800, height = 800): ProductImage {
  return { id, src: placeholderImg(width, height), alt, width, height };
}

const pdpYale: PDPProduct = {
  id: 'pdp-001',
  name: 'Cerradura Inteligente Yale YRD256 WiFi',
  slug: 'cerradura-inteligente-yale-yrd256',
  sku: 'YRD-256-WF',
  brand: 'Yale',
  brandSlug: 'yale',
  model: 'YRD256',
  internalCode: 'INT-YL-001',
  category: 'Cerraduras Inteligentes',
  categorySlug: 'cerraduras-inteligentes',
  subcategory: 'WiFi',
  subcategorySlug: 'wifi',
  price: 89999,
  originalPrice: 112999,
  discount: 20,
  savings: 23000,
  installments: [
    { count: 3, interest: true, installmentPrice: 32666 },
    { count: 6, interest: true, installmentPrice: 17499 },
    { count: 12, interest: false, installmentPrice: 8333 },
  ],
  images: [
    makeImage('img-1', 'Cerradura Yale YRD256 frente'),
    makeImage('img-2', 'Cerradura Yale YRD256 lateral'),
    makeImage('img-3', 'Cerradura Yale YRD256 instalada'),
    makeImage('img-4', 'Cerradura Yale YRD256 app'),
  ],
  videos: [
    { id: 'vid-1', src: 'https://www.youtube.com/watch?v=example', thumbnail: placeholderImg(480, 360), type: 'youtube' },
  ],
  status: 'active',
  inStock: true,
  stockCount: 15,
  isNew: false,
  isFeatured: true,
  badge: '20% OFF',
  badgeVariant: 'danger',
  estimatedDelivery: '24 horas',
  shipping: [
    { method: 'Envío estándar', cost: 0, estimatedDays: '1-2 días hábiles' },
    { method: 'Envío express', cost: 5000, estimatedDays: '12-24 horas' },
    { method: 'Retiro en sucursal', cost: 0, estimatedDays: 'Disponible en 2 horas' },
  ],
  warranty: '24 meses',
  variants: [
    { id: 'var-1', type: 'finish', label: 'Terminación', value: 'Negro mate', available: true },
    { id: 'var-2', type: 'finish', label: 'Terminación', value: 'Acero satinado', available: true },
    { id: 'var-3', type: 'finish', label: 'Terminación', value: 'Bronce', available: false },
    { id: 'var-4', type: 'version', label: 'Versión', value: 'WiFi', available: true },
    { id: 'var-5', type: 'version', label: 'Versión', value: 'Bluetooth', available: true },
    { id: 'var-6', type: 'version', label: 'Versión', value: 'Zigbee', available: false },
  ],
  shortDescription: 'Cerradura inteligente con conectividad WiFi, control remoto desde app Yale Home, y compatibilidad con asistentes de voz.',
  description:
    'La Cerradura Inteligente Yale YRD256 te brinda la tranquilidad de controlar el acceso a tu hogar desde cualquier lugar. Con conectividad WiFi integrada, podés bloquear y desbloquear la puerta, crear códigos de acceso temporales para invitados, y monitorear la actividad de entrada y salida directamente desde la app Yale Home en tu smartphone.\n\nSu diseño elegante y robusto combina seguridad de grado residencial con la comodidad de la tecnología inteligente. Compatible con Amazon Alexa, Google Assistant y Apple HomeKit, podés controlar tu cerradura con comandos de voz. La instalación es sencilla y no requiere cableado adicional, adaptándose a la mayoría de las puertas estándar.',
  features: [
    'Conectividad WiFi 2.4 GHz integrada',
    'Control remoto vía app Yale Home (iOS/Android)',
    'Compatible con Amazon Alexa, Google Assistant y Apple HomeKit',
    'Teclado táctil retroiluminado con código de acceso',
    'Cierre automático programable',
    'Hasta 250 códigos de usuario',
    'Historial de actividad en tiempo real',
    'Alarma antimanipulación integrada',
    'Batería de larga duración (4 pilas AA) con alerta de batería baja',
    'Grado de seguridad ANSI Grado 2',
  ],
  benefits: [
    'Control total desde cualquier lugar con la app Yale Home',
    'Olvidate de las llaves físicas — accedé con código o voz',
    'Creá códigos temporales para invitados, service o empleados',
    'Recibí notificaciones cada vez que alguien entra o sale',
    'Instalación fácil sin obras ni cableado',
  ],
  boxContents: [
    'Cerradura inteligente Yale YRD256',
    'Placa de montaje',
    'Kit de tornillos y anclajes',
    '4 pilas AA',
    'Guía de instalación rápida',
    'Manual de usuario',
    'Tarjeta de garantía',
  ],
  installation:
    'La instalación es simple y no requiere conocimientos técnicos avanzados. Solo necesitás un destornillador Phillips. El proceso toma aproximadamente 30 minutos y se adapta a puertas estándar de 35-45 mm de grosor. Incluye guía paso a paso con ilustraciones.',
  documentation: [
    { label: 'Manual de usuario (PDF)', url: '/docs/yale-yrd256-manual.pdf' },
    { label: 'Guía de instalación (PDF)', url: '/docs/yale-yrd256-instalacion.pdf' },
    { label: 'Ficha técnica (PDF)', url: '/docs/yale-yrd256-ficha.pdf' },
    { label: 'Declaración de conformidad', url: '/docs/yale-yrd256-cert.pdf' },
  ],
  specs: {
    Marca: 'Yale',
    Modelo: 'YRD256',
    SKU: 'YRD-256-WF',
    'Código interno': 'INT-YL-001',
    Tipo: 'Cerradura inteligente residencial',
    'Tipo de cerradura': 'Pasador / Doble pasador',
    Conectividad: 'WiFi 2.4 GHz + Bluetooth 4.2',
    'Asistentes de voz': 'Alexa, Google Assistant, Apple HomeKit',
    Alimentación: '4 pilas AA (incluidas)',
    'Duración de batería': 'Hasta 12 meses',
    Material: 'Aleación de zinc',
    Color: 'Negro mate',
    'Grado de seguridad': 'ANSI/BHMA Grado 2',
    'Capacidad de códigos': '250 usuarios',
    'Temperatura de operación': '-20°C a 60°C',
    Compatibilidad: 'Puertas estándar 35-45 mm',
    Dimensiones: '70 x 160 x 50 mm',
    Peso: '1.2 kg',
    Garantía: '24 meses',
    'Origen': 'Importado',
  },
  rating: 4.5,
  reviewCount: 128,
  reviews: [
    { id: 'rev-1', author: 'Carlos M.', avatar: undefined, rating: 5, date: '2025-12-15', title: 'Excelente producto', comment: 'La instalación fue muy sencilla y la app funciona de maravilla. La recomiendo totalmente.', verified: true, likes: 12 },
    { id: 'rev-2', author: 'María G.', avatar: undefined, rating: 4, date: '2025-11-28', title: 'Muy buena, pero...', comment: 'Me encanta la cerradura, es muy segura. El único detalle es que a veces la conexión WiFi se pierde. Por lo demás, perfecta.', verified: true, likes: 8 },
    { id: 'rev-3', author: 'Juan P.', avatar: undefined, rating: 5, date: '2025-10-10', title: 'Seguridad de primer nivel', comment: 'Desde que la instalé estoy mucho más tranquilo. Los códigos temporales son geniales para cuando vienen los servicios.', verified: true, likes: 15 },
    { id: 'rev-4', author: 'Ana L.', avatar: undefined, rating: 4, date: '2025-09-22', title: 'Buena relación precio-calidad', comment: 'Cumple con todo lo que promete. La batería dura bastante y la integración con Alexa es perfecta.', verified: true, likes: 6 },
    { id: 'rev-5', author: 'Pedro R.', avatar: undefined, rating: 5, date: '2025-08-05', title: 'La mejor compra del año', comment: 'Transformó mi casa. Ahora entro sin llaves y controlo todo desde el celular. Muy recomendable.', verified: true, likes: 20 },
    { id: 'rev-6', author: 'Lucía F.', avatar: undefined, rating: 3, date: '2025-07-18', title: 'Buena pero cara', comment: 'El producto es bueno, pero me parece un poco caro para lo que ofrece. La instalación fue sencilla.', verified: false, likes: 3 },
  ],
  questions: [
    { id: 'q-1', author: 'Roberto', date: '2025-12-20', question: '¿Funciona con puertas de metal?', answer: 'Sí, es compatible con puertas de metal siempre que el grosor esté dentro del rango especificado (35-45 mm).', answerDate: '2025-12-21', likes: 5 },
    { id: 'q-2', author: 'Sofía', date: '2025-12-18', question: '¿Se puede usar sin WiFi?', answer: 'Sí, funciona con el teclado táctil sin necesidad de WiFi. La conectividad WiFi es solo para control remoto.', answerDate: '2025-12-19', likes: 3 },
    { id: 'q-3', author: 'Diego', date: '2025-12-15', question: '¿Incluye llaves físicas de respaldo?', answer: 'No incluye llaves físicas. El acceso es mediante código numérico y app. Es un sistema 100% digital.', answerDate: '2025-12-16', likes: 4 },
    { id: 'q-4', author: 'Valentina', date: '2025-12-10', question: '¿Cuánto dura la batería?', answer: undefined, answerDate: undefined, likes: 2 },
  ],
  relatedSlugs: [
    'camara-ip-ezviz-c8c-pro-4k',
    'videoportero-ip-intelbras-amt-8000',
    'sensor-puerta-samsung-smartthings',
    'camara-ptz-hikvision-5mp',
  ],
  crossSellSlugs: [
    'hub-samsung-smartthings-v3',
    'sensor-movimiento-intelbras-ivp-7000',
    'control-acceso-yale-conexis-l2',
    'camara-interior-ezviz-c6n-2k',
  ],
};

const pdpEzviz: PDPProduct = {
  id: 'pdp-002',
  name: 'Cámara IP Ezviz C8C Pro 4K',
  slug: 'camara-ip-ezviz-c8c-pro-4k',
  sku: 'C8C-PRO-4K',
  brand: 'Ezviz',
  brandSlug: 'ezviz',
  model: 'C8C Pro',
  internalCode: 'INT-EZ-001',
  category: 'Cámaras de Seguridad',
  categorySlug: 'camaras-seguridad',
  subcategory: 'Exterior',
  subcategorySlug: 'exterior',
  price: 45999,
  originalPrice: 57999,
  discount: 21,
  savings: 12000,
  installments: [
    { count: 3, interest: true, installmentPrice: 17000 },
    { count: 6, interest: true, installmentPrice: 9000 },
    { count: 12, interest: false, installmentPrice: 4250 },
  ],
  images: [
    makeImage('img-1', 'Cámara Ezviz C8C Pro frente'),
    makeImage('img-2', 'Cámara Ezviz C8C Pro lateral'),
    makeImage('img-3', 'Cámara Ezviz C8C Pro instalada'),
  ],
  videos: [],
  status: 'active',
  inStock: true,
  stockCount: 23,
  isNew: false,
  isFeatured: false,
  badge: '21% OFF',
  badgeVariant: 'danger',
  estimatedDelivery: '48 horas',
  shipping: [
    { method: 'Envío estándar', cost: 0, estimatedDays: '1-3 días hábiles' },
    { method: 'Envío express', cost: 4000, estimatedDays: '12-24 horas' },
    { method: 'Retiro en sucursal', cost: 0, estimatedDays: 'Disponible en 2 horas' },
  ],
  warranty: '12 meses',
  variants: [
    { id: 'var-1', type: 'version', label: 'Versión', value: '4K', available: true },
    { id: 'var-2', type: 'version', label: 'Versión', value: '2K', available: true },
  ],
  shortDescription: 'Cámara IP exterior 4K con visión nocturna a color, detección inteligente de movimiento y resistente a la intemperie.',
  description:
    'La Cámara IP Ezviz C8C Pro 4K ofrece la máxima definición para la vigilancia de tu hogar o negocio. Con resolución 4K Ultra HD, cada detalle es capturado con una claridad impresionante. Su lente gran angular de 360° y visión nocturna a color te permiten monitorear cada rincón, incluso en completa oscuridad.\n\nEquipada con detección inteligente de movimiento con inteligencia artificial, la cámara distingue entre personas, vehículos y mascotas, reduciendo las falsas alarmas. Su diseño resistente al agua y polvo (IP66) la hace ideal para exteriores.',
  features: [
    'Resolución 4K Ultra HD (3840x2160)',
    'Visión nocturna a color hasta 15 metros',
    'Lente motorizado con rotación 360° horizontal, 80° vertical',
    'Detección inteligente AI: personas, vehículos, mascotas',
    'Audio bidireccional con micrófono y altavoz integrados',
    'Alarma integrada con sirena y luz estroboscópica',
    'Certificación IP66 resistente a la intemperie',
    'Ranura para microSD hasta 256 GB',
    'Compatible con Ezviz Cloud y NVR',
    'Cifrado de extremo a extremo',
  ],
  benefits: [
    'Calidad de imagen profesional 4K para identificar detalles importantes',
    'Vigilancia 24/7 sin puntos ciegos gracias al movimiento motorizado',
    'Alertas inteligentes solo cuando realmente importa',
    'Podés hablar con quien esté al otro lado de la cámara',
    'Almacenamiento flexible: local en microSD o en la nube',
  ],
  boxContents: [
    'Cámara Ezviz C8C Pro 4K',
    'Soporte de pared',
    'Kit de tornillos y tacos',
    'Adaptador de corriente con cable de 3 m',
    'Guía de instalación rápida',
    'Manual de usuario',
    'Calcomanía de advertencia',
  ],
  installation:
    'La instalación es sencilla con el soporte incluido. Conectá el adaptador de corriente, fijá la cámara al soporte en la pared, y seguí los pasos en la app Ezviz para vincularla a tu red WiFi.',
  documentation: [
    { label: 'Manual de usuario (PDF)', url: '/docs/ezviz-c8c-pro-manual.pdf' },
    { label: 'Guía rápida (PDF)', url: '/docs/ezviz-c8c-pro-guia.pdf' },
  ],
  specs: {
    Marca: 'Ezviz',
    Modelo: 'C8C Pro',
    SKU: 'C8C-PRO-4K',
    'Código interno': 'INT-EZ-001',
    Tipo: 'Cámara IP exterior',
    Resolución: '4K Ultra HD (3840x2160)',
    'Ángulo de visión': '360° horizontal / 80° vertical',
    'Visión nocturna': 'Color hasta 15 m',
    Conectividad: 'WiFi 2.4 GHz + Ethernet',
    Audio: 'Bidireccional',
    Alimentación: 'DC 12V / 1A',
    'Certificación': 'IP66',
    'Almacenamiento': 'microSD hasta 256 GB + Cloud',
    Dimensiones: '110 x 110 x 150 mm',
    Peso: '0.6 kg',
    Garantía: '12 meses',
  },
  rating: 4.7,
  reviewCount: 89,
  reviews: [
    { id: 'rev-1', author: 'Martín D.', rating: 5, date: '2025-11-20', title: 'Impresionante calidad', comment: 'La calidad de imagen es espectacular. La instalación fue muy fácil con la app.', verified: true, likes: 14 },
    { id: 'rev-2', author: 'Gabriela S.', rating: 5, date: '2025-10-15', title: 'Muy recomendable', comment: 'La visión nocturna a color es increíble. Se nota la diferencia con otras cámaras.', verified: true, likes: 9 },
    { id: 'rev-3', author: 'Federico L.', rating: 4, date: '2025-09-01', title: 'Buena cámara', comment: 'Muy buena calidad general. El único pero es que el cable de corriente podría ser más largo.', verified: true, likes: 5 },
  ],
  questions: [
    { id: 'q-1', author: 'Laura', date: '2025-11-25', question: '¿Funciona con paneles solares?', answer: 'Sí, es compatible con el panel solar Ezviz CSR-C8W.', answerDate: '2025-11-26', likes: 3 },
    { id: 'q-2', author: 'Pablo', date: '2025-11-10', question: '¿Se puede usar sin suscripción?', answer: 'Sí, funciona sin suscripción usando la ranura microSD para grabación local.', answerDate: '2025-11-11', likes: 7 },
  ],
  relatedSlugs: [
    'cerradura-inteligente-yale-yrd256',
    'videoportero-ip-intelbras-amt-8000',
    'camara-ptz-hikvision-5mp',
    'kit-camaras-hikvision-8ch-4k',
  ],
  crossSellSlugs: [
    'sensor-movimiento-intelbras-ivp-7000',
    'nvr-dahua-16-canales-4k',
    'camara-interior-ezviz-c6n-2k',
    'almacenamiento-microsd-256gb',
  ],
};

export const pdpProducts: PDPProduct[] = [pdpYale, pdpEzviz];

export function getProductBySlug(slug: string): PDPProduct | undefined {
  return pdpProducts.find((p) => p.slug === slug);
}

export function getRelatedProducts(slugs: string[]): PDPProduct[] {
  return pdpProducts.filter((p) => slugs.includes(p.slug));
}
