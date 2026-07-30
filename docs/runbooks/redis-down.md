# Runbook: Redis Down

## Síntomas

- Cache falla (RedisService.get/set lanzan excepción)
- Colas BullMQ no procesan jobs
- Health check Redis reporta unhealthy
- Logs: `RedisConnectionException` o `RedisUnavailableException`

## Diagnóstico

```bash
# 1. Verificar conectividad
redis-cli -h localhost -p 6379 ping  # Debería responder PONG

# 2. Verificar health endpoint
curl http://localhost:4000/health

# 3. Logs de la aplicación
# Buscar "Redis" en logs

# 4. Verificar proceso
ps aux | grep redis
systemctl status redis  # o service redis status
```

## Causas Comunes

| Causa | Solución |
|-------|----------|
| Redis no iniciado | `systemctl start redis` o `docker start redis` |
| Puerto incorrecto | Verificar env `REDIS_URL` |
| Firewall | Verificar reglas de firewall |
| Memoria agotada | `redis-cli info memory` |
| Password inválida | Verificar `REDIS_PASSWORD` env |

## Resolución

```bash
# 1. Iniciar Redis
systemctl start redis

# 2. Verificar conexión
redis-cli ping

# 3. Verificar health
curl http://localhost:4000/health

# 4. Si es Redis config, reiniciar app
pnpm --filter @tienda/backend dev
```
