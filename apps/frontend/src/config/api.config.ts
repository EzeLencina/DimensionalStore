export const apiConfig = {
  baseUrl: process.env["NEXT_PUBLIC_API_URL"] ?? 'http://localhost:4000/api/v1',
  timeout: 30_000,
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
  },
} as const;
