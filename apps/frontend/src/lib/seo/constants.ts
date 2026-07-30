export const SITE_NAME = 'Tienda';
export const SITE_DESCRIPTION = 'Seguridad inteligente, cerraduras digitales, cámaras HD, control de acceso y domótica. Envíos a todo el país. 12 cuotas sin interés.';
export const SITE_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3000';
export const SITE_LOCALE = 'es_AR';
export const SITE_LANGUAGE = 'es';
export const SITE_THEME_COLOR = '#1e293b';
export const SITE_TWITTER_HANDLE = '@tienda';

export const TITLE_TEMPLATE = '%s | Tienda';
export const DEFAULT_TITLE = 'Tienda — Seguridad Inteligente y Domótica';
export const DEFAULT_DESCRIPTION = SITE_DESCRIPTION;

export const OG_IMAGE_DEFAULT = '/og-default.jpg';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export const ORGANIZATION = {
  name: 'Tienda',
  legalName: 'Tienda S.A.',
  url: SITE_URL,
  logo: '/logo.png',
  sameAs: [
    'https://facebook.com/tienda',
    'https://instagram.com/tienda',
    'https://twitter.com/tienda',
  ],
  address: {
    street: 'Av. Siempre Viva 123',
    locality: 'Buenos Aires',
    region: 'CABA',
    country: 'AR',
  },
  contact: {
    telephone: '+54-11-1234-5678',
    email: 'hola@tienda.com',
    whatsapp: '+5491112345678',
  },
};

export const ROBOTS_RULES = {
  public: { index: true, follow: true },
  private: { index: false, follow: false },
};
