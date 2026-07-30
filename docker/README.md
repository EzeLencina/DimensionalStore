# Docker — Tienda

Infraestructura Docker para el entorno de desarrollo del monorepo.

---

## Árbol completo

```
docker/
├── backend/
│   └── Dockerfile            # NestJS (multi-etapa: deps → dev)
├── frontend/
│   └── Dockerfile            # Next.js (multi-etapa: deps → dev)
├── postgres/
│   └── init.sql              # Scripts de inicialización (vacío)
├── redis/
│   └── redis.conf            # Persistencia + AOF
│
├── scripts/
│   ├── dev.sh                # docker compose up --build -d
│   ├── stop.sh               # docker compose down
│   ├── restart.sh            # docker compose restart
│   ├── reset.sh              # down -v + rm volumes
│   ├── logs.sh               # docker compose logs -f [service]
│   └── rebuild.sh            # docker compose build --no-cache [service]
│
└── README.md

── Root ──
├── docker-compose.yml         # Servicios + networks + volumes
├── docker-compose.override.yml# Puertos locales + overrides dev
├── .env.docker.example        # Template de variables de entorno
└── .dockerignore               # Exclusiones para build
```

---

## Arquitectura de contenedores

```
┌─────────────────────────────────────────────────────┐
│                    tienda-network                    │
│                                                      │
│  ┌──────────┐   ┌──────────┐   ┌──────────────────┐ │
│  │ postgres │   │  redis   │   │     backend       │ │
│  │ :5432    │   │ :6379    │   │ :4000             │ │
│  │ vol: pg  │   │ vol: rds │   │ deps: pg, redis   │ │
│  └────┬─────┘   └────┬─────┘   └────────┬─────────┘ │
│       │              │                   │           │
│       └──────────────┴───────────────────┘           │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │               frontend                        │   │
│  │               :3000                           │   │
│  │               deps: backend                   │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## Flujo de red

- Todos los servicios en la red `tienda-network` (bridge)
- Los contenedores se resuelven por nombre de servicio:
  - `postgres:5432` → PostgreSQL
  - `redis:6379` → Redis
  - `backend:4000` → NestJS API
  - `frontend:3000` → Next.js
- Puertos expuestos al host solo en override (dev): 3000, 4000, 5432, 6379
- Servicios internos (PostgreSQL, Redis) no expuestos en producción

---

## Estrategia de volúmenes

| Volumen | Contenedor | Propósito |
|---------|-----------|-----------|
| `tienda-postgres` | postgres | Datos persistentes de PostgreSQL |
| `tienda-redis` | redis | Datos persistentes de Redis (AOF + RDB) |
| `tienda-uploads` | (futuro) | Archivos subidos por usuarios |
| `tienda-logs` | (futuro) | Logs de la aplicación |

Volúmenes anónimos en los servicios de aplicación:
- `/app/node_modules` — preserva node_modules del contenedor (evita que el mount del host lo sobrescriba)
- `/app/apps/backend/node_modules`
- `/app/apps/frontend/node_modules`
- `/app/packages/database/node_modules`

---

## Variables de entorno

Crear `.env.docker` a partir de `.env.docker.example`:

```bash
cp .env.docker.example .env.docker
```

### Variables requeridas

| Variable | Default | Servicio |
|----------|---------|----------|
| `POSTGRES_USER` | `postgres` | postgres |
| `POSTGRES_PASSWORD` | `postgres` | postgres |
| `POSTGRES_DB` | `tienda` | postgres |
| `DATABASE_URL` | `postgresql://...` | backend |
| `REDIS_URL` | `redis://redis:6379` | backend |
| `JWT_SECRET` | `change-me-...` | backend |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/...` | frontend |

### Diferencia clave con `.env` local

- `DATABASE_URL` apunta a `postgres` (nombre del contenedor), no a `localhost`
- `REDIS_URL` apunta a `redis` (nombre del contenedor), no a `localhost`

---

## Comandos disponibles

```bash
# Iniciar entorno
./docker/scripts/dev.sh

# Ver logs (todos o de un servicio)
./docker/scripts/logs.sh
./docker/scripts/logs.sh backend
./docker/scripts/logs.sh frontend

# Detener
./docker/scripts/stop.sh

# Reiniciar servicios
./docker/scripts/restart.sh

# Reconstruir imágenes (todos o un servicio)
./docker/scripts/rebuild.sh
./docker/scripts/rebuild.sh backend

# Reset completo (borra volúmenes)
./docker/scripts/reset.sh
```

### Comandos Docker Compose directos

```bash
docker compose up --build -d    # Iniciar
docker compose down             # Detener
docker compose down -v          # Detener + borrar volúmenes
docker compose logs -f          # Logs
docker compose build --no-cache # Reconstruir
```

---

## Health Checks

| Servicio | Comando | Intervalo |
|----------|---------|-----------|
| postgres | `pg_isready` | 5s |
| redis | `redis-cli ping` | 5s |
| backend | `GET /api/v1/health` | 15s |

`depends_on` con `condition: service_healthy` asegura que backend solo inicia cuando PostgreSQL y Redis están listos.

---

## Dockerfiles

### Backend (`docker/backend/Dockerfile`)

```
Stage: deps
  - node:20-alpine
  - corepack enable pnpm
  - COPY package manifests
  - pnpm install --frozen-lockfile
  - prisma generate

Stage: dev (hereda de deps)
  - COPY node_modules + Prisma Client
  - CMD: pnpm --filter @tienda/backend dev
  - Hot reload via NestJS --watch
```

### Frontend (`docker/frontend/Dockerfile`)

```
Stage: deps
  - node:20-alpine
  - corepack enable pnpm
  - COPY package manifests
  - pnpm install --frozen-lockfile

Stage: dev (hereda de deps)
  - COPY node_modules
  - WATCHPACK_POLLING=true (hot reload en Docker)
  - CMD: pnpm --filter @tienda/frontend dev
```

---

## Recomendaciones

1. **Primer inicio**: Usar `./docker/scripts/dev.sh` que crea `.env.docker` automáticamente.
2. **Sin Docker**: Ejecutar PostgreSQL/Redis localmente y usar `pnpm dev`.
3. **Rendimiento**: Los volúmenes anónimos para `node_modules` evitan copias innecesarias entre host y contenedor.
4. **Hot reload**: Next.js usa `WATCHPACK_POLLING=true` para detectar cambios en bind mounts.
5. **Prisma**: Si se cambia `schema.prisma`, reconstruir la imagen del backend (`./docker/scripts/rebuild.sh backend`).
6. **Logs**: Usar `./docker/scripts/logs.sh backend` para debug.
7. **Persistencia**: `docker compose down -v` borra todos los datos. Usar `reset.sh` con precaución.
8. **Extensiones Docker**: Se asume Docker Compose V2 (plugin de Docker CLI). No requiere `docker-compose` standalone.
