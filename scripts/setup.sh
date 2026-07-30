#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Setting up Tienda monorepo..."

# Install dependencies
pnpm install

# Copy env files if not exist
[[ ! -f apps/backend/.env ]] && cp apps/backend/.env.example apps/backend/.env
[[ ! -f apps/frontend/.env ]] && cp apps/frontend/.env.example apps/frontend/.env

# Generate Prisma client
pnpm --filter @tienda/database db:generate

# Build all packages
pnpm build

echo "✅ Setup complete. Run 'pnpm dev' to start."
