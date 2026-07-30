export const appConfig = {
  name: 'Tienda',
  version: process.env["NEXT_PUBLIC_APP_VERSION"] ?? '0.0.0',
  environment: process.env["NODE_ENV"],
  url: process.env["NEXT_PUBLIC_API_URL"] ?? 'http://localhost:3000',
} as const;
