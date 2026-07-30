import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@providers/query-provider';
import { ToastProvider } from '@providers/toast-provider';
import { ModalProvider } from '@providers/modal-provider';
import { OrganizationSchema, WebsiteSchema } from '@components/seo';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Tienda — Seguridad Inteligente y Domótica',
    template: '%s | Tienda',
  },
  description: 'Seguridad inteligente, cerraduras digitales, cámaras HD, control de acceso y domótica. Envíos a todo el país. 12 cuotas sin interés.',
  metadataBase: new URL(process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3000'),
  keywords: ['seguridad inteligente', 'cerraduras digitales', 'cámaras HD', 'domótica', 'control de acceso', 'hogar inteligente'],
  authors: { name: 'Tienda' },
  creator: 'Tienda',
  publisher: 'Tienda',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'Tienda',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@tienda',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
  other: {
    'theme-color': '#1e293b',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.variable}>
        <OrganizationSchema />
        <WebsiteSchema />
        <QueryProvider>
          <ModalProvider>
            {children}
            <ToastProvider />
          </ModalProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
