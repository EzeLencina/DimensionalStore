# Storage Module — Capa de Abstracción de Almacenamiento

Módulo completamente desacoplado para almacenamiento de archivos. Independiente del proveedor: Local, S3-compatible (R2, MinIO, S3), o Memoria (testing).

---

## 1. Árbol del Módulo

```
src/core/storage/
├── index.ts                          # Barrel export público
├── storage.module.ts                 # Módulo NestJS @Global()
├── README.md                         # Documentación
│
├── config/
│   └── index.ts                      # StorageConfigurationFactory
│
├── interfaces/
│   ├── index.ts                      # Barrel
│   ├── storage-driver.interface.ts   # IStorageDriver
│   └── storage-manager.interface.ts  # IStorageManager
│
├── drivers/
│   ├── index.ts                      # Barrel
│   ├── local.driver.ts               # LocalDriver — filesystem
│   ├── s3-compatible.driver.ts       # S3CompatibleDriver — R2/MinIO/S3 (esqueleto)
│   └── memory.driver.ts              # MemoryDriver — testing en memoria
│
├── factory/
│   └── index.ts                      # StorageDriverFactory
│
├── services/
│   ├── index.ts                      # Barrel
│   ├── storage-manager.service.ts    # StorageManagerService
│   └── storage.service.ts            # StorageService (fachada)
│
├── health/
│   └── index.ts                      # StorageHealthService
│
├── constants/
│   ├── index.ts                      # Barrel
│   ├── storage-tokens.ts             # Tokens DI
│   ├── storage-defaults.ts           # Valores por defecto
│   └── storage-error-codes.ts        # Códigos de error
│
├── exceptions/
│   ├── index.ts                      # Barrel
│   ├── upload-failed.exception.ts
│   ├── download-failed.exception.ts
│   ├── delete-failed.exception.ts
│   ├── provider-unavailable.exception.ts
│   ├── storage-timeout.exception.ts
│   ├── invalid-file.exception.ts
│   └── configuration-error.exception.ts
│
├── types/
│   ├── index.ts                      # Barrel
│   ├── storage.types.ts              # Tipos de almacenamiento
│   ├── file.types.ts                 # Tipos de archivo
│   └── path.types.ts                 # Tipos de ruta
│
├── utils/
│   ├── index.ts                      # Barrel
│   ├── path-builder.ts               # Construcción de rutas
│   └── file-sanitizer.ts             # Sanitización de nombres
│
└── adapters/
    ├── index.ts                      # MulterAdapter + barrel
    └── stream.adapter.ts             # StreamAdapter
```

---

## 2. Explicación de cada carpeta

| Carpeta | Propósito |
|---------|-----------|
| `config/` | `StorageConfigurationFactory` — lee `@tienda/config/storageConfig()` + env vars. |
| `interfaces/` | Contratos `IStorageDriver` e `IStorageManager`. Ningún servicio del dominio depende de implementaciones concretas. |
| `drivers/` | Implementaciones concretas de `IStorageDriver`. Cada driver encapsula un proveedor. |
| `factory/` | `StorageDriverFactory` — selecciona el driver según `STORAGE_DRIVER` env. |
| `services/` | `StorageManagerService` (gestiona el driver activo) + `StorageService` (fachada de alto nivel). |
| `health/` | `StorageHealthService` — verifica disponibilidad y latencia del driver activo. |
| `constants/` | Tokens DI, valores por defecto, códigos de error. |
| `exceptions/` | 7 excepciones que extienden `AppException`. |
| `types/` | Tipos compartidos: operaciones, archivos, rutas. |
| `utils/` | `PathBuilder` (rutas por namespace) + `FileSanitizer` (nombres seguros). |
| `adapters/` | `MulterAdapter` (convierte archivos Multer a `FileData`) + `StreamAdapter` (utilidades de streams). |

---

## 3. Arquitectura de Providers

```
[NestJS DI Container]
        │
        ├── StorageConfigurationFactory ← @tienda/config
        │
        ├── StorageDriverFactory
        │       │
        │       ├── LocalDriver        ← filesystem
        │       ├── S3CompatibleDriver ← esqueleto (S3/R2/MinIO futuro)
        │       └── MemoryDriver       ← Map en memoria
        │
        ├── StorageManagerService      ← selecciona driver vía Factory
        │
        ├── StorageService             ← fachada pública
        │
        ├── StorageHealthService       ← health checks
        │
        ├── MulterAdapter              ← conversión Multer → FileData
        │
        └── StreamAdapter              ← utilidades de streams
```

El driver activo se determina por `STORAGE_DRIVER=local|s3|memory` (default: `local`).

---

## 4. Estrategia de Drivers

| Driver | Variable | Estado | Uso |
|--------|----------|--------|-----|
| `LocalDriver` | `STORAGE_DRIVER=local` | ✅ Completo | Desarrollo local |
| `S3CompatibleDriver` | `STORAGE_DRIVER=s3` | 🏗 Esqueleto | Cloudflare R2 / MinIO / S3 (fase futura) |
| `MemoryDriver` | `STORAGE_DRIVER=memory` | ✅ Completo | Testing unitario |

El `S3CompatibleDriver` lanza `ProviderUnavailableException` en todas las operaciones. Su implementación real requiere AWS SDK v3 y será desarrollada en una fase posterior.

`MemoryDriver` expone `clear()` y `count()` para facilitar la limpieza en tests.

---

## 5. Flujo de operaciones

```
[StorageService] → [StorageManager] → [IStorageDriver]
                                           │
                              ┌────────────┼────────────┐
                              │            │            │
                         LocalDriver  S3Driver   MemoryDriver
```

**Upload:**
1. `StorageService.upload(namespace, filename, fileData)`
2. `PathBuilder.build(namespace, filename)` → `"products/123-image.jpg"`
3. `IStorageDriver.upload(path, fileData)` → `FileResult`

**Download:**
1. `StorageService.download(path)`
2. `IStorageDriver.download(path)` → `FileData`

**Delete:**
1. `StorageService.delete(path)`
2. `IStorageDriver.delete(path)`

---

## 6. Estrategia de Paths

Las rutas se organizan por namespace para evitar colisiones y facilitar la administración:

```
products/{product-id}/{filename}
customers/{customer-id}/{filename}
suppliers/{supplier-id}/{filename}
users/{user-id}/{filename}
documents/{type}/{filename}
reports/{type}/{filename}
exports/{type}/{timestamp}-{filename}
imports/{type}/{timestamp}-{filename}
temp/{session-id}/{filename}
backups/{type}/{timestamp}-{filename}
logos/{filename}
avatars/{user-id}/{filename}
invoices/{invoice-id}/{filename}
csv/{type}/{filename}
```

El `PathBuilder` ofrece helpers:
- `build(namespace, ...segments)` — ruta estándar
- `temp(...segments)` — ruta temporal
- `withTimestamp(namespace, filename)` — prefijo timestamp
- `withUuid(namespace, filename)` — prefijo UUID
- `parse(fullPath)` — extrae namespace, directorio, nombre, extensión

---

## 7. Convenciones de nombres

- **Nombres sanitizados**: `FileSanitizer` elimina caracteres peligrosos (`<>:"/\|?*`).
- **Nombres en lowercase**: todo se convierte a minúsculas.
- **Espacios reemplazados**: espacios → guion bajo.
- **Prefijo único**: `{timestamp}-{random}-{filename}` evita colisiones.
- **Sin path traversal**: `LocalDriver` rechaza `../`.
- **Extensiones**: se conservan tal cual (ej. `.jpg`, `.pdf`, `.csv`).

---

## 8. Recomendaciones de rendimiento

1. **Usar `LocalDriver` solo en desarrollo**: no escala horizontalmente.
2. **Preferir streams sobre buffers** para archivos grandes (>10MB).
3. **Configurar `STORAGE_MAX_FILE_SIZE`** según el caso de uso (default 10MB).
4. **Usar `MemoryDriver` en tests** para evitar IO y limpiar rápido con `clear()`.
5. **Namespace `temp/`** para archivos transitorios con limpieza periódica.
6. **AWS SDK v3 futuro** — usar `S3CompatibleDriver` con R2/MinIO cuando esté implementado.
7. **Signed URLs** para acceso temporario sin exponer credenciales.

---

## 9. Riesgos detectados

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| S3 driver no implementado | Sin almacenamiento cloud hasta fase futura | `ProviderUnavailableException` clara. |
| Path traversal en LocalDriver | Acceso no autorizado al sistema de archivos | Sanitización con `replace(/\.\.[\/\\]/g, '')`. |
| Archivos huérfanos en temp/ | Acumulación en disco | Limpieza periódica externa (fase futura). |
| Sin CDN | Latencia en descargas globales | Previsto para fase futura (Cloudflare). |
| Sin encriptación | Datos sensibles en texto plano | Encriptación del lado del servidor prevista. |
| Sin virus scan | Archivos maliciosos | Integración con antivirus prevista. |
| Sin backups automáticos | Pérdida de datos | Backup module en fase futura. |
| Sin control de versiones | Sobrescritura accidental | Versionado S3 previsto. |
| `MulterAdapter` acoplado a Express | Dependencia del framework HTTP | Desacoplable, el adapter transforma el formato. |

---

## Variables de entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `STORAGE_DRIVER` | `local` | Tipo de driver: `local`, `s3`, `memory` |
| `STORAGE_LOCAL_PATH` | `./storage` | Ruta local para `LocalDriver` |
| `STORAGE_ENDPOINT` | `http://localhost:9000` | Endpoint S3-compatible |
| `STORAGE_REGION` | `auto` | Región S3 |
| `STORAGE_ACCESS_KEY` | `minioadmin` | Access key S3 |
| `STORAGE_SECRET_KEY` | `minioadmin` | Secret key S3 |
| `STORAGE_BUCKET` | `tienda-assets` | Bucket por defecto |
| `STORAGE_FORCE_PATH_STYLE` | `true` | Path style para MinIO |
| `STORAGE_MAX_FILE_SIZE` | `10485760` | Tamaño máximo en bytes |

## Notas de implementación

- **Provider-agnostic**: toda interacción via `IStorageDriver`. Cambiar de Local a S3 requiere solo cambiar `STORAGE_DRIVER`.
- **S3 driver es esqueleto**: todas las operaciones lanzan `ProviderUnavailableException`. Se implementará con AWS SDK v3 en fase posterior.
- **MemoryDriver útil en tests**: implementación completa con `Map` en memoria, expone `clear()` y `count()`.
- **Module @Global()**: ya importado en `CoreModule`, disponible en toda la app.
- **TypeScript strict**: `noUncheckedIndexedAccess`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`.
- **Logger**: `Logger` de `@nestjs/common` para consistencia con el core.
- **Errores**: 7 excepciones extendiendo `AppException`, capturadas por `GlobalExceptionFilter`.
