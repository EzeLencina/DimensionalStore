export type NavCategory = {
  id: string;
  name: string;
  slug: string;
  href: string;
  icon?: string;
  description?: string;
  image?: string;
  featured?: boolean;
  children?: NavSubcategory[];
  brands?: NavBrand[];
};

export type NavSubcategory = {
  id: string;
  name: string;
  slug: string;
  href: string;
  description?: string;
  children?: { id: string; name: string; slug: string; href: string }[];
};

export type NavBrand = {
  id: string;
  name: string;
  slug: string;
  href: string;
  logo?: string;
  featured?: boolean;
};

export type NavPage = {
  id: string;
  name: string;
  href: string;
  icon?: string;
  badge?: string;
  external?: boolean;
};

export type AnnoucementConfig = {
  text: string;
  href?: string;
  cta?: string;
  dismissible?: boolean;
};

export type TopBarConfig = {
  shipping: string;
  installments: string;
  warranty: string;
  support: string;
  promotions: string;
};

export type SocialLink = {
  name: string;
  href: string;
  icon: string;
};

export type PaymentMethod = {
  id: string;
  name: string;
  icon: string;
};

export type ShippingMethod = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

export const categories: NavCategory[] = [
  {
    id: '1',
    name: 'Procesadores',
    slug: 'procesadores',
    href: '/categoria/procesadores',
    description: 'CPUs para gaming, trabajo y servidores',
    icon: 'cpu',
    featured: true,
    image: '/images/categories/processors.jpg',
    children: [
      {
        id: '1-1',
        name: 'Intel',
        slug: 'intel',
        href: '/categoria/procesadores/intel',
        children: [
          { id: '1-1-1', name: 'Core i3', slug: 'core-i3', href: '/categoria/procesadores/intel/core-i3' },
          { id: '1-1-2', name: 'Core i5', slug: 'core-i5', href: '/categoria/procesadores/intel/core-i5' },
          { id: '1-1-3', name: 'Core i7', slug: 'core-i7', href: '/categoria/procesadores/intel/core-i7' },
          { id: '1-1-4', name: 'Core i9', slug: 'core-i9', href: '/categoria/procesadores/intel/core-i9' },
          { id: '1-1-5', name: 'Ultra', slug: 'ultra', href: '/categoria/procesadores/intel/ultra' },
        ],
      },
      {
        id: '1-2',
        name: 'AMD',
        slug: 'amd',
        href: '/categoria/procesadores/amd',
        children: [
          { id: '1-2-1', name: 'Ryzen 3', slug: 'ryzen-3', href: '/categoria/procesadores/amd/ryzen-3' },
          { id: '1-2-2', name: 'Ryzen 5', slug: 'ryzen-5', href: '/categoria/procesadores/amd/ryzen-5' },
          { id: '1-2-3', name: 'Ryzen 7', slug: 'ryzen-7', href: '/categoria/procesadores/amd/ryzen-7' },
          { id: '1-2-4', name: 'Ryzen 9', slug: 'ryzen-9', href: '/categoria/procesadores/amd/ryzen-9' },
          { id: '1-2-5', name: 'Threadripper', slug: 'threadripper', href: '/categoria/procesadores/amd/threadripper' },
        ],
      },
    ],
    brands: [
      { id: 'b1', name: 'Intel', slug: 'intel', href: '/marca/intel', featured: true },
      { id: 'b2', name: 'AMD', slug: 'amd', href: '/marca/amd', featured: true },
    ],
  },
  {
    id: '2',
    name: 'Placas de Video',
    slug: 'placas-de-video',
    href: '/categoria/placas-de-video',
    description: 'GPUs para gaming, diseño y minería',
    icon: 'monitor',
    featured: true,
    image: '/images/categories/gpus.jpg',
    children: [
      {
        id: '2-1',
        name: 'NVIDIA',
        slug: 'nvidia',
        href: '/categoria/placas-de-video/nvidia',
        children: [
          { id: '2-1-1', name: 'GeForce RTX 4060', slug: 'rtx-4060', href: '/categoria/placas-de-video/nvidia/rtx-4060' },
          { id: '2-1-2', name: 'GeForce RTX 4070', slug: 'rtx-4070', href: '/categoria/placas-de-video/nvidia/rtx-4070' },
          { id: '2-1-3', name: 'GeForce RTX 4080', slug: 'rtx-4080', href: '/categoria/placas-de-video/nvidia/rtx-4080' },
          { id: '2-1-4', name: 'GeForce RTX 5090', slug: 'rtx-5090', href: '/categoria/placas-de-video/nvidia/rtx-5090' },
        ],
      },
      {
        id: '2-2',
        name: 'AMD Radeon',
        slug: 'amd-radeon',
        href: '/categoria/placas-de-video/amd',
        children: [
          { id: '2-2-1', name: 'RX 7600', slug: 'rx-7600', href: '/categoria/placas-de-video/amd/rx-7600' },
          { id: '2-2-2', name: 'RX 7700', slug: 'rx-7700', href: '/categoria/placas-de-video/amd/rx-7700' },
          { id: '2-2-3', name: 'RX 7800', slug: 'rx-7800', href: '/categoria/placas-de-video/amd/rx-7800' },
          { id: '2-2-4', name: 'RX 7900', slug: 'rx-7900', href: '/categoria/placas-de-video/amd/rx-7900' },
        ],
      },
    ],
    brands: [
      { id: 'b3', name: 'NVIDIA', slug: 'nvidia', href: '/marca/nvidia', featured: true },
      { id: 'b4', name: 'AMD', slug: 'amd', href: '/marca/amd', featured: true },
      { id: 'b5', name: 'ASUS', slug: 'asus', href: '/marca/asus' },
      { id: 'b6', name: 'MSI', slug: 'msi', href: '/marca/msi' },
      { id: 'b7', name: 'Gigabyte', slug: 'gigabyte', href: '/marca/gigabyte' },
    ],
  },
  {
    id: '3',
    name: 'Motherboards',
    slug: 'motherboards',
    href: '/categoria/motherboards',
    description: 'Placas madre para todas las plataformas',
    icon: 'circuit-board',
    children: [
      {
        id: '3-1',
        name: 'Socket Intel',
        slug: 'socket-intel',
        href: '/categoria/motherboards/intel',
        children: [
          { id: '3-1-1', name: 'LGA 1700', slug: 'lga-1700', href: '/categoria/motherboards/intel/lga-1700' },
          { id: '3-1-2', name: 'LGA 1851', slug: 'lga-1851', href: '/categoria/motherboards/intel/lga-1851' },
        ],
      },
      {
        id: '3-2',
        name: 'Socket AMD',
        slug: 'socket-amd',
        href: '/categoria/motherboards/amd',
        children: [
          { id: '3-2-1', name: 'AM4', slug: 'am4', href: '/categoria/motherboards/amd/am4' },
          { id: '3-2-2', name: 'AM5', slug: 'am5', href: '/categoria/motherboards/amd/am5' },
        ],
      },
    ],
  },
  {
    id: '4',
    name: 'Memoria RAM',
    slug: 'memoria-ram',
    href: '/categoria/memoria-ram',
    description: 'Módulos DDR4 y DDR5',
    icon: 'memory-stick',
    children: [
      { id: '4-1', name: 'DDR4', slug: 'ddr4', href: '/categoria/memoria-ram/ddr4' },
      { id: '4-2', name: 'DDR5', slug: 'ddr5', href: '/categoria/memoria-ram/ddr5' },
      { id: '4-3', name: 'Laptop', slug: 'laptop', href: '/categoria/memoria-ram/laptop' },
      { id: '4-4', name: 'Servidores', slug: 'servidores', href: '/categoria/memoria-ram/servidores' },
    ],
  },
  {
    id: '5',
    name: 'Almacenamiento',
    slug: 'almacenamiento',
    href: '/categoria/almacenamiento',
    description: 'SSD, HDD y almacenamiento externo',
    icon: 'hard-drive',
    children: [
      { id: '5-1', name: 'SSD NVMe', slug: 'ssd-nvme', href: '/categoria/almacenamiento/ssd-nvme' },
      { id: '5-2', name: 'SSD SATA', slug: 'ssd-sata', href: '/categoria/almacenamiento/ssd-sata' },
      { id: '5-3', name: 'HDD', slug: 'hdd', href: '/categoria/almacenamiento/hdd' },
      { id: '5-4', name: 'Externo', slug: 'externo', href: '/categoria/almacenamiento/externo' },
    ],
  },
  {
    id: '6',
    name: 'Gabinetes',
    slug: 'gabinetes',
    href: '/categoria/gabinetes',
    description: 'Torres y gabinetes gaming',
    icon: 'box',
    children: [
      { id: '6-1', name: 'Full Tower', slug: 'full-tower', href: '/categoria/gabinetes/full-tower' },
      { id: '6-2', name: 'Mid Tower', slug: 'mid-tower', href: '/categoria/gabinetes/mid-tower' },
      { id: '6-3', name: 'Mini ITX', slug: 'mini-itx', href: '/categoria/gabinetes/mini-itx' },
      { id: '6-4', name: 'OEM', slug: 'oem', href: '/categoria/gabinetes/oem' },
    ],
  },
  {
    id: '7',
    name: 'Fuentes',
    slug: 'fuentes',
    href: '/categoria/fuentes',
    description: 'Fuentes de alimentación certificadas',
    icon: 'zap',
    children: [
      { id: '7-1', name: 'Certificadas', slug: 'certificadas', href: '/categoria/fuentes/certificadas' },
      { id: '7-2', name: 'Modulares', slug: 'modulares', href: '/categoria/fuentes/modulares' },
      { id: '7-3', name: 'Gaming', slug: 'gaming', href: '/categoria/fuentes/gaming' },
    ],
  },
  {
    id: '8',
    name: 'Periféricos',
    slug: 'perifericos',
    href: '/categoria/perifericos',
    description: 'Teclados, mouse, auriculares y más',
    icon: 'keyboard',
    children: [
      {
        id: '8-1',
        name: 'Teclados',
        slug: 'teclados',
        href: '/categoria/perifericos/teclados',
        children: [
          { id: '8-1-1', name: 'Mecánicos', slug: 'mecanicos', href: '/categoria/perifericos/teclados/mecanicos' },
          { id: '8-1-2', name: 'Membrana', slug: 'membrana', href: '/categoria/perifericos/teclados/membrana' },
        ],
      },
      { id: '8-2', name: 'Mouse', slug: 'mouse', href: '/categoria/perifericos/mouse' },
      { id: '8-3', name: 'Auriculares', slug: 'auriculares', href: '/categoria/perifericos/auriculares' },
      { id: '8-4', name: 'Mousepads', slug: 'mousepads', href: '/categoria/perifericos/mousepads' },
    ],
  },
  {
    id: '9',
    name: 'Monitores',
    slug: 'monitores',
    href: '/categoria/monitores',
    description: 'Pantallas para gaming, diseño y oficina',
    icon: 'monitor',
    children: [
      { id: '9-1', name: 'Gaming', slug: 'gaming', href: '/categoria/monitores/gaming' },
      { id: '9-2', name: 'Profesional', slug: 'profesional', href: '/categoria/monitores/profesional' },
      { id: '9-3', name: 'Ultrawide', slug: 'ultrawide', href: '/categoria/monitores/ultrawide' },
    ],
  },
  {
    id: '10',
    name: 'Audio',
    slug: 'audio',
    href: '/categoria/audio',
    description: 'Parlantes, barras de sonido y accesorios',
    icon: 'speaker',
    children: [
      { id: '10-1', name: 'Parlantes', slug: 'parlantes', href: '/categoria/audio/parlantes' },
      { id: '10-2', name: 'Soundbars', slug: 'soundbars', href: '/categoria/audio/soundbars' },
      { id: '10-3', name: 'Microfonos', slug: 'microfonos', href: '/categoria/audio/microfonos' },
    ],
  },
  {
    id: '11',
    name: 'Redes',
    slug: 'redes',
    href: '/categoria/redes',
    description: 'Routers, switches y accesorios de red',
    icon: 'wifi',
    children: [
      { id: '11-1', name: 'Routers', slug: 'routers', href: '/categoria/redes/routers' },
      { id: '11-2', name: 'Switches', slug: 'switches', href: '/categoria/redes/switches' },
      { id: '11-3', name: 'Access Point', slug: 'access-point', href: '/categoria/redes/access-point' },
    ],
  },
  {
    id: '12',
    name: 'Notebooks',
    slug: 'notebooks',
    href: '/categoria/notebooks',
    description: 'Laptops para trabajo, estudio y gaming',
    icon: 'laptop',
    featured: true,
    image: '/images/categories/laptops.jpg',
    children: [
      { id: '12-1', name: 'Gamer', slug: 'gamer', href: '/categoria/notebooks/gamer' },
      { id: '12-2', name: 'Profesional', slug: 'profesional', href: '/categoria/notebooks/profesional' },
      { id: '12-3', name: 'Ultrabook', slug: 'ultrabook', href: '/categoria/notebooks/ultrabook' },
    ],
  },
  {
    id: '13',
    name: 'Consolas',
    slug: 'consolas',
    href: '/categoria/consolas',
    description: 'PlayStation, Xbox, Nintendo y accesorios',
    icon: 'gamepad-2',
    children: [
      { id: '13-1', name: 'PlayStation', slug: 'playstation', href: '/categoria/consolas/playstation' },
      { id: '13-2', name: 'Xbox', slug: 'xbox', href: '/categoria/consolas/xbox' },
      { id: '13-3', name: 'Nintendo', slug: 'nintendo', href: '/categoria/consolas/nintendo' },
    ],
  },
];

export const featuredBrands: NavBrand[] = [
  { id: 'b1', name: 'Intel', slug: 'intel', href: '/marca/intel', featured: true },
  { id: 'b2', name: 'AMD', slug: 'amd', href: '/marca/amd', featured: true },
  { id: 'b3', name: 'NVIDIA', slug: 'nvidia', href: '/marca/nvidia', featured: true },
  { id: 'b4', name: 'ASUS', slug: 'asus', href: '/marca/asus', featured: true },
  { id: 'b5', name: 'MSI', slug: 'msi', href: '/marca/msi', featured: true },
  { id: 'b6', name: 'Gigabyte', slug: 'gigabyte', href: '/marca/gigabyte', featured: true },
  { id: 'b7', name: 'Corsair', slug: 'corsair', href: '/marca/corsair', featured: true },
  { id: 'b8', name: 'Samsung', slug: 'samsung', href: '/marca/samsung', featured: true },
  { id: 'b9', name: 'Kingston', slug: 'kingston', href: '/marca/kingston' },
  { id: 'b10', name: 'Logitech', slug: 'logitech', href: '/marca/logitech' },
  { id: 'b11', name: 'Razer', slug: 'razer', href: '/marca/razer' },
  { id: 'b12', name: 'HyperX', slug: 'hyperx', href: '/marca/hyperx' },
];

export const mainNavPages: NavPage[] = [
  { id: 'offers', name: 'Ofertas', href: '/ofertas', icon: 'tag' },
  { id: 'new', name: 'Novedades', href: '/novedades', icon: 'sparkles' },
  { id: 'brands', name: 'Marcas', href: '/marcas', icon: 'building-2' },
  { id: 'contact', name: 'Contacto', href: '/contacto', icon: 'headset' },
];

export const accountPages: NavPage[] = [
  { id: 'account', name: 'Mi Cuenta', href: '/cuenta', icon: 'user' },
  { id: 'orders', name: 'Mis Pedidos', href: '/cuenta/pedidos', icon: 'package' },
  { id: 'favorites', name: 'Favoritos', href: '/cuenta/favoritos', icon: 'heart' },
  { id: 'compare', name: 'Comparador', href: '/compara', icon: 'arrow-left-right' },
];

export const footerSections = [
  {
    id: 'company',
    title: 'Empresa',
    links: [
      { name: 'Sobre Nosotros', href: '/about' },
      { name: 'Trabajá con Nosotros', href: '/trabaja-con-nosotros' },
      { name: 'Prensa', href: '/prensa' },
      { name: 'Blog', href: '/blog' },
      { name: 'Afiliados', href: '/afiliados' },
    ],
  },
  {
    id: 'help',
    title: 'Ayuda',
    links: [
      { name: 'Centro de Ayuda', href: '/ayuda' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Términos y Condiciones', href: '/terminos' },
      { name: 'Política de Privacidad', href: '/privacidad' },
      { name: 'Reclamos', href: '/reclamos' },
    ],
  },
  {
    id: 'purchases',
    title: 'Compras',
    links: [
      { name: 'Cómo Comprar', href: '/ayuda/como-comprar' },
      { name: 'Medios de Pago', href: '/ayuda/medios-de-pago' },
      { name: 'Envíos', href: '/ayuda/envios' },
      { name: 'Cambios y Devoluciones', href: '/ayuda/cambios' },
      { name: 'Garantía', href: '/ayuda/garantia' },
    ],
  },
  {
    id: 'contact',
    title: 'Contacto',
    links: [
      { name: 'Atención al Cliente', href: '/contacto' },
      { name: 'WhatsApp', href: 'https://wa.me/541234567890', external: true },
      { name: 'Email', href: 'mailto:soporte@tienda.com', external: true },
      { name: 'Soporte Técnico', href: '/soporte' },
      { name: 'Sucursales', href: '/sucursales' },
    ],
  },
];

export const socialLinks: SocialLink[] = [
  { name: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
  { name: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
  { name: 'Twitter/X', href: 'https://x.com', icon: 'twitter' },
  { name: 'YouTube', href: 'https://youtube.com', icon: 'youtube' },
  { name: 'TikTok', href: 'https://tiktok.com', icon: 'tiktok' },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
];

export const paymentMethods: PaymentMethod[] = [
  { id: 'visa', name: 'Visa', icon: 'visa' },
  { id: 'mastercard', name: 'Mastercard', icon: 'mastercard' },
  { id: 'amex', name: 'American Express', icon: 'amex' },
  { id: 'mercadopago', name: 'Mercado Pago', icon: 'mercadopago' },
  { id: 'uala', name: 'Ualá', icon: 'credit-card' },
  { id: 'transferencia', name: 'Transferencia Bancaria', icon: 'building-bank' },
  { id: 'efectivo', name: 'Efectivo', icon: 'banknote' },
];

export const shippingMethods: ShippingMethod[] = [
  { id: 'express', name: 'Express 24hs', icon: 'rocket', description: 'Envío en 24 horas' },
  { id: 'standard', name: 'Estándar', icon: 'truck', description: 'De 3 a 7 días hábiles' },
  { id: 'pickup', name: 'Retiro en Tienda', icon: 'store', description: 'Sin costo adicional' },
  { id: 'free', name: 'Envío Gratis', icon: 'package-check', description: 'Compras mayores a $150.000' },
];

export const announcementConfig: AnnoucementConfig = {
  text: '🚀 ENVÍO GRATIS en compras mayores a $150.000 | 12 CUOTAS SIN INTERÉS con Mercado Pago',
  href: '/ofertas',
  cta: 'Ver ofertas',
  dismissible: true,
};

export const topBarConfig: TopBarConfig = {
  shipping: 'Envíos a todo el país',
  installments: '12 cuotas sin interés',
  warranty: 'Garantía oficial',
  support: 'Soporte técnico especializado',
  promotions: 'Descuentos exclusivos',
};

export const popularSearches = [
  'RTX 5090', 'Ryzen 7', 'i9 14900K', 'DDR5 32GB', 'SSD 1TB NVMe',
  'Teclado mecánico', 'Monitor 27 pulgadas', 'Mouse gamer', 'Auriculares',
  'Fuente 850W', 'Motherboard Z790', 'Notebook gamer',
];

export const mockRoutes = {
  home: '/',
  catalog: '/catalogo',
  category: '/categoria',
  product: '/producto',
  cart: '/carrito',
  checkout: '/checkout',
  login: '/iniciar-sesion',
  register: '/registrarse',
  account: '/cuenta',
  offers: '/ofertas',
  brands: '/marcas',
  contact: '/contacto',
  about: '/about',
} as const;
