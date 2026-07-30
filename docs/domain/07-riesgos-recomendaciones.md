# RIESGOS DETECTADOS Y RECOMENDACIONES

---

## 1. Riesgos Detectados

| # | Riesgo | Impacto | Probabilidad | Mitigación |
|---|--------|---------|-------------|-----------|
| DR01 | **Complejidad de 18 Bounded Contexts** puede llevar a sobreingeniería en etapas tempranas | Medio | Alta | Priorizar implementación de contextos core (Catalog, Sales, Inventory, Identity). Los contextos generic (CMS, Marketing, Analytics) pueden ser simplificados en MVP. |
| DR02 | **SKU inmutable post-venta** puede generar fricción si el negocio necesita renombrar SKUs | Bajo | Media | El SKU es el identificador de negocio. Si se necesita cambiar: crear nuevo SKU, vincular al viejo como "reemplazo", descontinuar el anterior. No permitir renombre directo. |
| DR03 | **Consistencia eventual entre Sales e Inventory** puede generar sobreventa (overselling) si el stock no se actualiza rápido | Alto | Baja | Reserva de stock en el momento de crear la orden (PENDING). Tiempo de ventana: segundos. Si hay race condition, la validación final ocurre al confirmar. |
| DR04 | **Particionamiento de tablas** implementado tarde puede requerir migración compleja | Medio | Media | Implementar particionamiento por mes desde el inicio en tablas de alta escritura (InventoryMovement, AuditLog, Order). No esperar a que sea necesario. |
| DR05 | **Audit logs** pueden volverse un bottleneck de escritura | Medio | Alta | Cola asíncrona (BullMQ) para auditoría. Si la cola se atrasa, no afecta transacciones críticas. Batch writes cada 500ms. |
| DR06 | **Multi-tenancy con shared DB** puede tener problemas de noisy neighbor (un tenant ruinoso afecta a otros) | Alto | Baja | Monitorear query performance por tenant. Límites de concurrencia por tenant (pg_tenant_limits o aplicación). Plan de migración a DB dedicada para tenants grandes. |
| DR07 | **Desnormalización de SKU en todas las tablas transaccionales** puede llevar a inconsistencia si el SKU "padre" se descontinúa | Bajo | Media | El SKU es un string inmutable en las tablas transaccionales (snapshot). La entidad Product puede descontinuarse, pero el SKU en ventas/compras históricas no cambia. |
| DR08 | **Soft delete generalizado** puede complicar queries si no se filtran correctamente los registros eliminados | Medio | Alta | Implementar índices parciales con WHERE deleted_at IS NULL. En el ORM, filtro global por defecto. Cultura de equipo: toda query de listado debe excluir soft-deleted. |
| DR09 | **18 contextos con eventos** puede ser complejo de debuggear en producción | Medio | Alta | OpenTelemetry tracing obligatorio. Cada evento lleva correlationId. Dashboard de trazabilidad de eventos en Grafana. |
| DR10 | **Crecimiento de tabla AuditLog** sin limpieza programada puede degradar performance | Medio | Alta | Job mensual de archivado. Política de retención clara. Particionamiento por mes desde el día 1. |
| DR11 | **CQRS sin event store** puede hacer que sea difícil reconstruir estado histórico | Bajo | Media | AuditLog ya guarda old/new values. Suficiente para la mayoría de casos. Si se necesita event sourcing en el futuro, migrar solo contextos específicos (Sales, Finance). |

---

## 2. Recomendaciones

### 2.1 Para la Fase de Implementación

| # | Recomendación | Prioridad |
|---|--------------|-----------|
| R01 | **Implementar por Vertical Slices, no por capas**. Un módulo completo de principio a fin (DTO → Controller → Handler → Domain → Repository → DB) es mejor que todas las entidades primero, todos los repositorios después. | Alta |
| R02 | **Empezar con 5 contextos core**: Identity, Catalog, Inventory, Sales, Configuration. Los demás pueden ser esquemas más simples inicialmente. | Alta |
| R03 | **El SKU debe ser el primer Value Object implementado**. Todo el sistema depende de él. Validación estricta desde el día 1. | Alta |
| R04 | **Particionar InventoryMovement y AuditLog por mes desde la primera migración**. Es trivial al inicio y doloroso después. | Alta |
| R05 | **No implementar todos los indexes desde el día 1**. Implementar los críticos (unique constraints, FK). Agregar índices de performance basados en queries reales. | Media |
| R06 | **Implementar RLS desde el día 1**, incluso en mono-tenant. El overhead es mínimo y cuando llegue el segundo tenant, el aislamiento ya funciona. | Alta |
| R07 | **Domain Events como ciudadanos de primera clase**. No como callbacks ocultos. Cada evento debe estar registrado, versionado y documentado. | Alta |
| R08 | **Inversión en pruebas de integración tempranas**. El módulo Orders (depende de Catalog + Inventory + Finance) es el de mayor riesgo de integración. | Alta |
| R09 | **Cachear lo que se lee mucho y escribe poco**: catálogo, categorías, configuración. No cachear lo transaccional (stock en tiempo real, órdenes). | Media |
| R10 | **Usar UUID v7 (time-ordered)** en vez de CUID o UUID v4 para evitar fragmentación de índices en tablas grandes. | Media |

### 2.2 Para la Evolución del Producto

| # | Recomendación | Horizonte |
|---|--------------|-----------|
| R11 | **Monitorear tamaño de tablas mensualmente**. Cuando una tabla supere 10GB, evaluar particionamiento si no está ya implementado. | 6 meses |
| R12 | **Evaluar migración a DB dedicada** cuando un tenant supere 100GB de datos o 1000 transacciones/minuto sostenidas. | 12 meses |
| R13 | **Si el volumen de eventos crece > 1000/segundo**, evaluar Kafka en lugar de BullMQ para eventos entre contextos. | 18 meses |
| R14 | **Si las queries de reportes se vuelven lentas (> 5s)**, migrar a una base de datos analítica (ClickHouse) con sync periódico desde PostgreSQL. | 12 meses |
| R15 | **Preparar SDK/clientes para la API pública** desde la fase 2. No esperar a que terceros pidan integración. | 6 meses |
| R16 | **Mantener un architecture decision record (ADR)** para cada decisión importante. Esto evita preguntarse "por qué hicimos esto" 2 años después. | Inmediato |

### 2.3 Para el Equipo

| # | Recomendación | Prioridad |
|---|--------------|-----------|
| R17 | **Un desarrollador no debería trabajar en más de 2 Bounded Contexts simultáneamente**. La carga cognitiva de DDD es alta. | Alta |
| R18 | **Code review obligatorio con checklist de dominio**: ¿la regla de negocio está en Domain y no en Application? ¿El evento tiene la información suficiente? ¿El Value Object se valida a sí mismo? | Alta |
| R19 | **Documentar el Lenguaje Ubicuo** en un glosario vivo. Cada sprint, revisar que los términos en código reflejen el lenguaje del negocio. | Media |
| R20 | **Event storming sessions** al inicio de cada nuevo contexto para alinear al equipo con el dominio. | Media |

---

## 3. Architecture Decision Records (ADRs) Recomendados

| ADR | Título | Descripción |
|-----|--------|-------------|
| ADR-001 | SKU como identificador universal | Justificar por qué SKU es string desnormalizado en tablas transaccionales |
| ADR-002 | Shared DB + RLS vs DB por tenant | Documentar la decisión de multi-tenancy y las condiciones para migrar |
| ADR-003 | Eventos coreografiados vs orquestados | Definir cuándo usar saga coreografiada vs orquestador central |
| ADR-004 | SKU inmutable post-venta | Establecer la política de inmutabilidad del SKU |
| ADR-005 | Soft delete vs hard delete por entidad | Documentar qué entidades tienen soft delete y por qué |
| ADR-006 | UUID v7 vs CUID vs Auto-increment | Justificar la elección de UUIDs para escalabilidad horizontal |
| ADR-007 | Particionamiento de tablas grandes | Cuándo y cómo particionar tablas transaccionales |
| ADR-008 | Consistencia fuerte vs eventual | Definir qué operaciones requieren transacción y cuáles toleran consistencia eventual |

---

## 4. Métricas de Salud del Modelo de Dominio

| Métrica | Objetivo | Cómo medirla |
|---------|----------|-------------|
| **Cohesión de módulos** | Cada módulo debe tratar un solo concepto | Revisión de dependencias: ¿un módulo importa de太多 contextos? |
| **Acoplamiento entre contextos** | Bajo (solo eventos e interfaces) | Diagrama de dependencias. Si A llama directamente a B (no vía evento), es deuda. |
| **Reglas de negocio en dominio** | > 90% en Domain Layer | Revisión de código: ¿hay lógica de negocio en controllers o handlers? |
| **Cobertura de invariantes** | 100% de invariantes documentados | Por cada entidad, verificar que sus invariantes están implementados en el constructor o factory. |
| **Consistencia de SKU** | SKU único siempre | Query de duplicados. Debe ser 0. |
| **Integridad de movimientos** | stockAfter = stockBefore + quantity | Auditoría nocturna de consistencia de movimientos vs stock actual. |
| **Tamaño de aggregates** | < 10 entidades por aggregate | Revisión periódica. Si un aggregate crece demasiado, dividir en submódulos. |
