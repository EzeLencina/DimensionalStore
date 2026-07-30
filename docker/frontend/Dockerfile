# ──────────────────────────────────────────────
# Stage 1: Dependencies
# ──────────────────────────────────────────────
FROM node:20-alpine AS deps
LABEL stage=deps

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/backend/package.json apps/backend/
COPY apps/frontend/package.json apps/frontend/
COPY packages/*/package.json packages/

RUN pnpm install --frozen-lockfile

# ──────────────────────────────────────────────
# Stage 2: Development
# ──────────────────────────────────────────────
FROM node:20-alpine AS dev
LABEL stage=dev

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

ENV WATCHPACK_POLLING=true
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["pnpm", "--filter", "@tienda/frontend", "dev"]
