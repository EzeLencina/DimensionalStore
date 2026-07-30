# Mail Module — Infraestructura de Correo Electrónico

Módulo completamente desacoplado para envío de emails. Independiente del proveedor: SMTP, Log (desarrollo), o esqueletos para SES, SendGrid, Mailgun, Resend.

---

## 1. Árbol del Módulo

```
src/core/mail/
├── index.ts                          # Barrel export público
├── mail.module.ts                    # Módulo NestJS @Global()
├── README.md                         # Documentación
│
├── config/
│   └── index.ts                      # MailConfigurationFactory
│
├── interfaces/
│   ├── index.ts                      # Barrel
│   ├── mail-provider.interface.ts    # IMailProvider
│   └── mail-manager.interface.ts     # IMailManager
│
├── drivers/
│   ├── index.ts                      # Barrel
│   ├── smtp.driver.ts                # SMTP via Nodemailer (funcional)
│   ├── log.driver.ts                 # LogDriver — solo logs (dev)
│   ├── ses.driver.ts                 # Amazon SES (esqueleto)
│   ├── sendgrid.driver.ts            # SendGrid (esqueleto)
│   ├── mailgun.driver.ts             # Mailgun (esqueleto)
│   └── resend.driver.ts              # Resend (esqueleto)
│
├── factory/
│   └── index.ts                      # MailDriverFactory
│
├── services/
│   ├── index.ts                      # Barrel
│   ├── mail-manager.service.ts       # MailManagerService
│   └── mail.service.ts               # MailService (fachada)
│
├── templates/
│   ├── index.ts                      # TemplateEngine
│   └── template-compiler.ts          # TemplateCompiler
│
├── renderer/
│   └── index.ts                      # TemplateRenderer
│
├── queue/
│   └── index.ts                      # MailQueueIntegration
│
├── health/
│   └── index.ts                      # MailHealthService
│
├── providers/
│   └── index.ts                      # mailProviderProvider (DI)
│
├── constants/
│   ├── index.ts                      # Barrel
│   ├── mail-tokens.ts                # Tokens DI
│   ├── mail-defaults.ts              # Valores por defecto
│   └── mail-error-codes.ts           # Códigos de error
│
├── exceptions/
│   └── index.ts                      # 10 excepciones
│
├── types/
│   ├── index.ts                      # Barrel
│   ├── mail.types.ts                 # Tipos de correo
│   └── template.types.ts             # Tipos de plantilla
│
└── utils/
    ├── index.ts                      # Barrel
    ├── mail-validator.ts             # Validación de direcciones
    └── sanitizer.ts                  # Sanitización de contenido
```

---

## 2. Arquitectura de Providers

```
[NestJS DI Container]
        │
        ├── MailConfigurationFactory ← @tienda/config + env vars
        │
        ├── MailDriverFactory
        │       │
        │       ├── SmtpDriver      ← Nodemailer (funcional, mock)
        │       ├── LogDriver       ← Solo registra en logger (dev por defecto)
        │       ├── SesDriver       ← Esqueleto (AWS SDK futuro)
        │       ├── SendgridDriver  ← Esqueleto (SDK futuro)
        │       ├── MailgunDriver   ← Esqueleto (SDK futuro)
        │       └── ResendDriver    ← Esqueleto (SDK futuro)
        │
        ├── MailManagerService      ← gestiona el driver activo
        │
        ├── MailService             ← fachada pública
        │
        ├── TemplateEngine          ← registro de plantillas
        ├── TemplateCompiler        ← compilación con variables
        ├── TemplateRenderer        ← renderizado final
        │
        ├── MailHealthService       ← health checks
        │
        └── MailQueueIntegration    ← integración BullMQ (futura)
```

El driver activo se determina por `MAIL_DRIVER` (default: `log`).

---

## 3. Flujo de envío

```
[MailService.send(options)]
        │
        ├── MailValidator.validateAddresses()
        ├── MailSanitizer.sanitizeMessage()
        │
        └── IMailProvider.send(options)
                │
                ├── SmtpDriver  →  Nodemailer (mock)
                ├── LogDriver   →  Logger.log()
                └── Otros       →  ProviderUnavailableException
                        │
                        └── SendMailResult
```

**Con template:**
```
[MailService]
        │
        ├── TemplateRenderer.render('welcome', { name })
        │       ├── TemplateEngine.getTemplate('welcome')
        │       └── TemplateCompiler.compile(html, variables)
        │
        └── IMailProvider.send({ html, subject })
```

**Con cola (futuro):**
```
[MailQueueIntegration.enqueue(options)]
        │
        └── [BullMQ Queue] → [Worker] → MailService.send()
```

---

## 4. Estrategia de Templates

| Componente | Propósito |
|------------|-----------|
| `TemplateEngine` | Registro y gestión de templates, layouts, partials |
| `TemplateCompiler` | Reemplazo de `{{variable}}` con valores |
| `TemplateRenderer` | Renderizado completo (template + layout + variables) |

El compilador usa sintaxis simple `{{variable}}`. Preparado para Handlebars/MJML en fase futura.

**Registro:**
```typescript
engine.registerTemplate({
  name: 'welcome',
  subject: 'Bienvenido {{name}}',
  html: '<h1>Hola {{name}}</h1>',
});
```

**Renderizado:**
```typescript
const result = renderer.render('welcome', { name: 'Juan' });
// result.html  → '<h1>Hola Juan</h1>'
// result.subject → 'Bienvenido Juan'
```

---

## 5. Estrategia Queue

`MailQueueIntegration` prepara la integración con BullMQ. NO crea jobs reales.

- `enqueue(message)` — prepara un email para envío asíncrono
- `enqueueBulk(messages)` — prepara múltiples emails
- `processQueuedMail(message)` — procesa un email desencolado
- `processQueuedBulk(messages)` — procesa lote desencolado

Soporta:
- `delay` — envío diferido
- `queuePriority` — prioridad BullMQ
- `jobId` — ID único para deduplicación

La conexión con BullMQ QueueManager y WorkerManager se realizará en fase posterior cuando se implementen los jobs de email.

---

## 6. Manejo de errores

| Excepción | Código | HTTP | Causa |
|-----------|--------|------|-------|
| `MailSendException` | MAIL_001 | 500 | Fallo genérico de envío |
| `MailConnectionException` | MAIL_002 | 503 | Conexión SMTP fallida |
| `MailAuthenticationException` | MAIL_003 | 502 | Credenciales inválidas |
| `MailProviderUnavailableException` | MAIL_004 | 503 | Provider no disponible |
| `MailTimeoutException` | MAIL_005 | 500 | Timeout de operación |
| `MailInvalidAddressException` | MAIL_006 | 400 | Email inválido |
| `MailTemplateException` | MAIL_007 | 500 | Error de template |
| `MailRendererException` | MAIL_008 | 500 | Error de renderizado |
| `MailConfigurationException` | MAIL_009 | 500 | Config inválida |
| `MailRateLimitException` | MAIL_010 | 429 | Límite excedido |

Todas extienden `AppException` y son capturadas por `GlobalExceptionFilter`.

---

## 7. Seguridad de correo

- **SPF Ready**: campo `from` configurable con dominio validable.
- **DKIM Ready**: infraestructura preparada para firmar correos (fase futura).
- **DMARC Ready**: políticas de alineación configurables (fase futura).
- **TLS**: `MAIL_TLS=true` fuerza conexión segura (default: true).
- **Credential Protection**: `MailSanitizer` oculta passwords, tokens y API keys en logs.
- **Validación**: `MailValidator` rechaza direcciones mal formateadas.
- **Nunca se registran**: contraseñas, tokens de acceso, contenido sensible.
- **Modo dev**: `MAIL_DRIVER=log` evita envíos accidentales desde desarrollo.

---

## 8. Recomendaciones

1. **Usar `MAIL_DRIVER=log` en desarrollo** para evitar envíos accidentales.
2. **Configurar `MAIL_FROM_ADDRESS`** con un dominio con SPF/DKIM/DMARC en producción.
3. **No usar SMTPPool en serverless** — deshabilitar con `MAIL_POOL=false`.
4. **Rate limiting**: `MAIL_RATE_LIMIT=10` y `MAIL_RATE_LIMIT_INTERVAL=1000` para evitar baneos.
5. **Templates**: registrar en `onModuleInit()` del módulo de negocio correspondiente.
6. **Adjuntos**: límite de 10MB por archivo (`MAIL_ATTACHMENT_SIZE_LIMIT`).
7. **Cola**: usar `MailQueueIntegration` para envíos asíncronos cuando BullMQ esté integrado.
8. **Monitoreo**: `MailHealthService.check()` periódicamente para detectar caídas del provider.

---

## 9. Riesgos detectados

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| SMTP no implementado (mock) | Sin envíos reales | LogDriver funcional para dev. Integración SMTP real pendiente de Nodemailer. |
| 5 drivers son esqueletos | No operativos en producción | `ProviderUnavailableException` clara. Implementación en fases futuras. |
| Sin Nodemailer instalado | SmtpDriver no funcional | Pendiente de `npm install nodemailer` y `@types/nodemailer`. |
| Sin Handlebars/MJML | Templates simples | TemplateCompiler con sintaxis `{{variable}}` básica. Extensible. |
| Rate limiting en memoria | No persiste entre reinicios | Solución temporal. Migrar a Redis rate limiter en fase futura. |
| Sin cola real | Bloqueo en envíos síncronos | MailQueueIntegration preparado para BullMQ. Integración pendiente. |
| Sin SPF/DKIM/DMARC | Marcado como spam | Infraestructura preparada. Configuración DNS en fase futura. |
| Adjuntos grandes en memoria | OOM en archivos grandes | Límite de 10MB. Streams para archivos mayores pendiente. |
| LogDriver sin adjuntos reales | Adjuntos no visibles en logs | Metadata de adjuntos registrada (nombre, cantidad, tamaño). |
| Sin validación de HTML | Riesgo de XSS en templates | MailSanitizer.stripHtml() disponible. Sanitización profunda pendiente. |

---

## Variables de entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `MAIL_DRIVER` | `log` | Driver: `smtp`, `log`, `ses`, `sendgrid`, `mailgun`, `resend` |
| `MAIL_HOST` | `smtp.mailtrap.io` | Host SMTP |
| `MAIL_PORT` | `2525` | Puerto SMTP |
| `MAIL_USER` | - | Usuario SMTP |
| `MAIL_PASS` | - | Password SMTP |
| `MAIL_FROM_ADDRESS` | `noreply@tienda.local` | Dirección remitente |
| `MAIL_FROM_NAME` | `Tienda` | Nombre remitente |
| `MAIL_REPLY_TO` | - | Dirección reply-to |
| `MAIL_TLS` | `true` | TLS forzado |
| `MAIL_TIMEOUT` | `10000` | Timeout en ms |
| `MAIL_RATE_LIMIT` | `10` | Máximo de envíos por intervalo |
| `MAIL_RATE_LIMIT_INTERVAL` | `1000` | Intervalo en ms |
| `MAIL_RETRY_ATTEMPTS` | `3` | Reintentos por envío |
| `MAIL_API_KEY` | - | API key para providers HTTP |
| `MAIL_REGION` | - | Región AWS SES |

---

## Notas de implementación

- **Provider-agnostic**: toda interacción via `IMailProvider`. Cambiar de Log a SMTP requiere solo `MAIL_DRIVER=smtp`.
- **SMTP mock funcional**: `SmtpDriver` ejecuta validaciones y loguea el envío pero no conecta con servidor real.
- **LogDriver por defecto**: modo seguro para desarrollo. Todos los "envíos" se registran en el logger.
- **Esqueletos**: SES, SendGrid, Mailgun, Resend lanzan `MailProviderUnavailableException`. Implementación real en fases posteriores.
- **Template engine simple**: compila `{{variable}}` con reemplazo de strings. Preparado para Handlebars/MJML.
- **Module @Global()**: ya importado en `CoreModule` desde `./mail/mail.module`.
- **TypeScript strict**: `noUncheckedIndexedAccess`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`.
- **Error handling**: 10 excepciones extendiendo `AppException`, capturadas por `GlobalExceptionFilter`.
- **Nunca registrar secrets**: `MailSanitizer` reemplaza authorization, tokens y passwords antes de loguear.
