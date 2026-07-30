# Runbook: Queues Stopped

## Síntomas

- Jobs no se procesan
- `QueueHealthService` reporta unhealthy
- Logs: `Worker error` o `Queue unavailable`
- BullMQ jobs stuck en "waiting" o "active"

## Diagnóstico

```bash
# 1. Verificar Redis (BullMQ depende de Redis)
redis-cli ping

# 2. Verificar health endpoint
curl http://localhost:4000/health

# 3. Ver workers activos
# Revisar logs de la aplicación

# 4. BullMQ dashboard (si está configurado)
# localhost:4000/queues
```

## Causas Comunes

| Causa | Solución |
|-------|----------|
| Redis caído | Ver runbook [redis-down.md](./redis-down.md) |
| Worker crash | Check logs, reiniciar worker |
| Job stuck | BullMQ stalled interval lo detecta automáticamente |
| Conexión Redis colas caída | Verificar `QUEUE_REDIS_URL` |
| Worker no registrado | Verificar `WorkerManager.createWorker()` en bootstrap |

## Resolución

```bash
# 1. Verificar Redis primero
redis-cli ping

# 2. Si Redis OK, reiniciar app
pnpm --filter @tienda/backend dev

# 3. Si workers no arrancan, verificar registro
# Revisar QueueManagerService.initialize() en logs
```
