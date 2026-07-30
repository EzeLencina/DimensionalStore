# Runbook: Storage Down

## Síntomas

- Upload de archivos falla
- Download de archivos falla
- Health check storage unhealthy
- Logs: `UploadFailedException` o `ProviderUnavailableException`

## Diagnóstico

```bash
# 1. Verificar health
curl http://localhost:4000/health

# 2. Verificar driver activo
# STORAGE_DRIVER env var

# 3. LocalDriver: verificar directorio
ls -la ./storage/

# 4. S3Driver: verificar credenciales
# STORAGE_ENDPOINT, STORAGE_ACCESS_KEY, etc.
```

## Causas Comunes

| Causa | Solución |
|-------|----------|
| LocalDriver: directorio no existe | Crear `./storage/` directory |
| LocalDriver: permisos | `chmod 755 ./storage/` |
| S3Driver: esqueleto | `S3CompatibleDriver` no implementado, cambiar a LocalDriver |
| S3Driver: credenciales inválidas | Verificar env vars |
| Disco lleno | Liberar espacio |

## Resolución

```bash
# 1. Verificar driver
echo $STORAGE_DRIVER

# 2. Si local, crear directorio
mkdir -p ./storage

# 3. Si S3, cambiar a local temporalmente
export STORAGE_DRIVER=local
pnpm --filter @tienda/backend dev
```
