# Runbook: Database Down

## Síntomas

- Health check database unhealthy
- Peticiones HTTP 503
- Logs: `PrismaService connection error`
- Prisma query timeout

## Diagnóstico

```bash
# 1. Verificar PostgreSQL
pg_isready -h localhost -p 5432

# 2. Logs de PostgreSQL
journalctl -u postgresql --no-pager -n 20

# 3. Verificar conexión desde app
curl http://localhost:4000/health

# 4. Connection pool
psql -c "SELECT count(*) FROM pg_stat_activity;"
```

## Causas Comunes

| Causa | Solución |
|-------|----------|
| PostgreSQL no iniciado | `systemctl start postgresql` |
| Conexiones agotadas | Aumentar `DATABASE_POOL_MAX` |
| Disco lleno | Liberar espacio |
| Query lenta bloqueando | Kill query: `SELECT pg_terminate_backend(pid)` |
| Credenciales inválidas | Verificar `DATABASE_URL` env |

## Resolución

```bash
# 1. Iniciar PostgreSQL
systemctl start postgresql

# 2. Verificar conectividad
pg_isready

# 3. Reintentar después de restaurar
curl http://localhost:4000/health

# 4. Si pool agotado, matar queries idle
psql -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle in transaction';"
```
