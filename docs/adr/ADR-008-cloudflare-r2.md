# ADR-008: Cloudflare R2 como Storage

## Contexto

La plataforma necesita almacenamiento de archivos (imágenes, documentos, exports).

## Problema

Elegir un servicio de object storage que sea S3-compatible, sin costos de egress, y multi-región.

## Alternativas

| Alternativa | Pros | Contras |
|-------------|------|---------|
| **Cloudflare R2** | S3-compatible, sin egress, edge network | Menos features que S3 |
| **AWS S3** | Maduro, features completas | Costos de egress, vendor lock |
| **MinIO** | Self-hosted, S3-compatible | Operación propia |
| **Google Cloud Storage** | Performance, integración GCP | Vendor lock |

## Decisión

Cloudflare R2 como storage principal con driver S3-compatible.

## Consecuencias

- `S3CompatibleDriver` esqueleto (implementación AWS SDK v3 futura)
- `LocalDriver` funcional para desarrollo
- `MemoryDriver` para testing
- Organización por namespaces (products, customers, invoices, etc.)
- `PathBuilder` para rutas estandarizadas
- `FileSanitizer` para nombres seguros
- Límite de 10MB por archivo configurable
- Sin CDN aún (planificado)
