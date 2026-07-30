# Módulo MFA

Infraestructura Multi-Factor Authentication desacoplada. Preparada para TOTP, Backup Codes, Trusted Devices, Recovery y hooks para futuros factores (Passkeys, WebAuthn, FIDO2, Email OTP, SMS OTP, Push Approval).

---

## Árbol completo

```
modules/mfa/
├── index.ts                                # Barrel público
├── mfa.module.ts                           # Módulo NestJS con DI
├── README.md
│
├── constants/
│   ├── index.ts
│   └── mfa.constants.ts                    # MFA_CONSTANTS: TOTP, backup codes, trusted device, challenge config
│
├── domain/                                 # ── Capa DDD ──
│   ├── index.ts
│   ├── types/
│   │   └── index.ts                        # MfaMethod, MfaStatus, MfaChallenge, MfaEnrollment, BackupCode, TrustedDevice, RecoveryToken, TotpSecretData, etc.
│   ├── value-objects/
│   │   ├── index.ts
│   │   ├── totp-secret.vo.ts              # TotpSecret: base32 validation
│   │   ├── backup-code-hash.vo.ts         # BackupCodeHash: SHA-256 hex validation
│   │   ├── trusted-device-info.vo.ts      # TrustedDeviceInfo: id, userId, deviceId, expiration
│   │   └── challenge-id.vo.ts             # ChallengeId: UUID wrapper
│   ├── events/
│   │   ├── domain-event.ts                 # Abstract base
│   │   ├── mfa-enabled.event.ts           # MFA habilitado
│   │   ├── mfa-disabled.event.ts          # MFA deshabilitado
│   │   ├── mfa-verified.event.ts          # Verificación exitosa
│   │   ├── challenge-created.event.ts     # Challenge generado
│   │   ├── recovery-started.event.ts      # Recovery iniciado
│   │   ├── backup-code-used.event.ts      # Backup code utilizado
│   │   ├── trusted-device-added.event.ts  # Device trust registrado
│   │   ├── trusted-device-removed.event.ts
│   │   └── index.ts
│   ├── exceptions/
│   │   ├── index.ts
│   │   └── mfa.exception.ts               # MfaException + MFA_ERROR_CODES (18 códigos)
│   └── services/
│       ├── index.ts
│       ├── stores.ts                       # Interfaces IChallengeStore, IEnrollmentStore, IBackupCodeStore, ITrustedDeviceStore, IRecoveryTokenStore, ITotpProvider, IHashingProvider
│       ├── mfa-domain.service.ts           # MfaDomainService: orchestrator (enroll, challenge, verify, disable, recovery, reset)
│       ├── backup-code-domain.service.ts   # BackupCodeDomainService: generation, format, validation
│       └── trusted-device-domain.service.ts # TrustedDeviceDomainService: trust, verify, remove, cleanup
│
├── application/                            # ── Puertos ──
│   ├── index.ts
│   ├── interfaces/
│   │   ├── index.ts
│   │   ├── mfa-service.interface.ts        # IMfaService
│   │   ├── totp-service.interface.ts       # ITotpService (RFC 6238)
│   │   └── stores.interface.ts            # IBackupCodeStore, ITrustedDeviceStore (simplified)
│   ├── dto/
│   │   └── index.ts                        # MfaEnrollRequestDto, MfaVerifyRequestDto, MfaChallengeResponseDto, etc.
│   ├── commands/
│   │   ├── index.ts
│   │   ├── enroll-mfa.command.ts           # EnrollMfaCommand
│   │   ├── verify-mfa.command.ts           # VerifyMfaCommand
│   │   ├── disable-mfa.command.ts          # DisableMfaCommand
│   │   ├── generate-backup-codes.command.ts
│   │   ├── trust-device.command.ts         # TrustDeviceCommand, RemoveTrustedDeviceCommand
│   │   └── recover-mfa.command.ts          # StartRecoveryCommand, CompleteRecoveryCommand
│   └── validators/
│       ├── index.ts
│       └── mfa.validators.ts               # MfaValidators: TOTP code, backup code, device ID, challenge ID, recovery token, MFA method
│
├── infrastructure/                         # ── Adaptadores ──
│   ├── index.ts
│   ├── totp/
│   │   ├── index.ts
│   │   └── totp-generator.service.ts       # TotpGeneratorService: RFC 6238 compliant (SHA1, HMAC, dynamic truncation, base32, QR payload)
│   ├── stores/
│   │   ├── index.ts
│   │   ├── in-memory-challenge.store.ts    # InMemoryChallengeStore
│   │   ├── in-memory-enrollment.store.ts   # InMemoryEnrollmentStore
│   │   ├── in-memory-backup-code.store.ts  # InMemoryBackupCodeStore
│   │   ├── in-memory-trusted-device.store.ts
│   │   └── in-memory-recovery-token.store.ts
│   └── hashing/
│       ├── index.ts
│       └── hashing.service.ts              # Sha256HashingService: SHA-256 + timingSafeEqual
│
├── presentation/                           # ── NestJS ──
│   ├── index.ts
│   ├── guards/
│   │   ├── index.ts
│   │   ├── mfa.guard.ts                   # MfaGuard: verifica @MfaRequired + MFA habilitado
│   │   └── mfa-challenge.guard.ts         # MfaChallengeGuard: verifica challenge via headers x-mfa-challenge-id + x-mfa-code
│   ├── decorators/
│   │   ├── index.ts
│   │   ├── mfa-required.decorator.ts      # @MfaRequired() mark endpoint
│   │   └── current-mfa.decorator.ts       # @CurrentMfa('verified'|'method'|'challengeId')
│   └── interceptors/
│       ├── index.ts
│       └── mfa-challenge.interceptor.ts   # MfaChallengeInterceptor: marca respuestas con _mfa: true
│
├── services/
│   ├── index.ts
│   └── mfa-app.service.ts                 # MfaAppService: @Injectable impl de IMfaService, orquesta domain services
│
├── providers/
│   ├── index.ts
│   └── mfa.providers.ts                   # MFA_PROVIDERS (8 providers: stores + totp + hashing + service)
│
├── events/
│   ├── index.ts
│   └── mfa-event.handler.ts               # MfaEventHandler: logs estructurados
│
├── exceptions/
│   ├── index.ts
│   └── http-exception.filter.ts           # MfaExceptionFilter: MfaException → HTTP status
│
└── validators/
    ├── index.ts
    └── mfa.validators.ts                  # Re-export validators from application layer
```

---

## Arquitectura MFA

```
┌──────────────────────────────────────────────────────────────────┐
│                        MFA Module                                │
│                                                                  │
│  Capa de Presentación (NestJS)                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐       │
│  │  @MfaRequired│  │ MfaGuard     │  │ MfaChallengeGuard│       │
│  │  @CurrentMfa │  │ (verifica    │  │ (verifica        │       │
│  │              │  │  MFA activo) │  │  challenge+code) │       │
│  └──────────────┘  └──────────────┘  └──────────────────┘       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │               MfaAppService (@Injectable)                 │    │
│  │  - enrollTotp()  - verifyTotp()  - generateChallenge()   │    │
│  │  - verifyChallenge()  - generateBackupCodes()            │    │
│  │  - trustDevice()   - isTrustedDevice()                   │    │
│  │  - disableMfa()  - startRecovery()  - completeRecovery() │    │
│  └──────────────────────────┬───────────────────────────────┘    │
│                             │                                     │
│  ┌──────────────────────────▼───────────────────────────────┐    │
│  │               MfaDomainService (orquestrador)             │    │
│  │  - enrollTotp() → IEnrollmentStore + ITotpProvider       │    │
│  │  - generateChallenge() → IChallengeStore                 │    │
│  │  - verifyChallenge() → IChallengeStore + ITotpProvider   │    │
│  │  - verifyBackupCode() → IBackupCodeStore + IHashingProvider│   │
│  │  - trustDevice() → TrustedDeviceDomainService            │    │
│  │  - startRecovery() → IRecoveryTokenStore                  │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌──────────────┐               │
│  │ BackupCode  │ │ TrustedDev │ │ ─ futuro ─   │               │
│  │ DomainSvc   │ │ DomainSvc   │ │ Passkeys,    │               │
│  │             │ │             │ │ WebAuthn,    │               │
│  │ generate()  │ │ trust()     │ │ FIDO2,       │               │
│  │ verify()    │ │ isTrusted() │ │ Email OTP,   │               │
│  │ format()    │ │ remove()    │ │ SMS OTP, etc │               │
│  └──────┬──────┘ └──────┬──────┘ └──────────────┘               │
│         │               │                                        │
│  ┌──────▼──────┐  ┌─────▼───────┐                               │
│  │InMemory     │  │InMemory     │                               │
│  │BackupCode   │  │TrustedDevice│                               │
│  │Store        │  │Store        │                               │
│  └─────────────┘  └─────────────┘                               │
│                                                                  │
│  ┌────────────────┐ ┌────────────────┐ ┌──────────────────┐     │
│  │ TotpGenerator  │ │Sha256Hashing   │ │ ChallengeStore   │     │
│  │ (RFC 6238)     │ │(SHA-256+CT)   │ │ EnrollmentStore  │     │
│  │                │ │                │ │ RecoveryTokStore │     │
│  │ HMAC-SHA1      │ │ hash/verify   │ │ (todos InMemory) │     │
│  │ Dynamic Trunc. │ │ constant-time  │ └──────────────────┘     │
│  │ Base32 + QR    │ └────────────────┘                          │
│  └────────────────┘                                             │
└──────────────────────────────────────────────────────────────────┘
```

---

## Flujo Enrollment

```
Usuario
   │
   ▼
┌─────────────────────────────────────────────────┐
│  POST /mfa/enroll  { method: "totp" }           │
│  Headers: Authorization: Bearer <jwt>            │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  MfaGuard: @MfaRequired                          │
│  → verifica que el usuario está autenticado      │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  MfaAppService.enrollTotp()                      │
│                                                  │
│  1. Verificar que TOTP no está ya habilitado     │
│     si existe enrollment activo → MFA_ALREADY_   │
│     ENABLED (409)                                │
│                                                  │
│  2. TotpProvider.generateSecret()                │
│     → 20 bytes aleatorios → base32               │
│                                                  │
│  3. IEnrollmentStore.save({ userId, method,      │
│     secret, status: 'active' })                  │
│                                                  │
│  4. build TotpSecretData { secret, issuer,       │
│     accountName, algorithm, digits, period }     │
│                                                  │
│  5. return secretData (SOLO UNA VEZ)             │
│     el secret no se vuelve a exponer             │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  Response 201:                                   │
│  {                                               │
│    userId, method, status,                       │
│    secretData: {                                 │
│      secret: "JBSWY3DPEHPK3PXP",                │
│      algorithm: "SHA1",                          │
│      digits: 6, period: 30,                     │
│      issuer: "Tienda",                           │
│      accountName: "user@email.com"               │
│    }                                             │
│  }                                               │
└─────────────────────────────────────────────────┘
```

---

## Flujo Verification

```
Cliente (app autenticador)
   │
   ▼
┌─────────────────────────────────────────────────┐
│  POST /mfa/verify                                │
│  { challengeId, code: "123456" }                 │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  MfaAppService.verifyChallenge() ->              │
│  MfaDomainService.verifyChallenge()              │
│                                                  │
│  1. IChallengeStore.findById(challengeId)        │
│     → NO encontrado → MFA_CHALLENGE_INVALID      │
│                                                  │
│  2. Verificar status === 'pending'               │
│     → no es pending → CHALLENGE_INVALID          │
│                                                  │
│  3. Verificar expiresAt > now                    │
│     → expirado → status='expired', CHALLENGE_    │
│     EXPIRED                                      │
│                                                  │
│  4. Verificar attempts < maxAttempts             │
│     → excedido → status='failed', MAX_ATTEMPTS_  │
│     EXCEEDED                                     │
│                                                  │
│  5. Incrementar attempts                         │
│                                                  │
│  6. Verificar según método:                      │
│     TOTP: TotpProvider.verifyCode(secret, code)   │
│           con clock skew window = ±1 step         │
│     Backup Code: hashingProvider.verify(hash,    │
│                   code) + mark usado             │
│                                                  │
│  7. Si falla → store.update(challenge)           │
│     → throw MfaException                         │
│                                                  │
│  8. Si OK → status='verified', verifiedAt=now    │
│     → store.update(challenge)                    │
│     → return { verified: true, userId, method }  │
└─────────────────────────────────────────────────┘
```

---

## Flujo Recovery

```
Usuario (perdió acceso al autenticador)
   │
   ▼
┌─────────────────────────────────────────────────────┐
│  POST /mfa/recovery/start                           │
│  Headers: Authorization: Bearer <jwt>               │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│  MfaAppService.startRecovery()                      │
│                                                     │
│  1. Verificar que MFA está habilitado               │
│  2. Generar rawToken (64 hex chars)                 │
│  3. Hash(token) → guardar en RecoveryTokenStore     │
│     (expira en 1 hora)                              │
│  4. Devolver rawToken (SOLO UNA VEZ)                │
│     → Response: { token, expiresAt }                │
└───────────────────────┬─────────────────────────────┘
                        │
   Usuario usa el token │ antes de 1 hora
                        ▼
┌─────────────────────────────────────────────────────┐
│  POST /mfa/recovery/complete                        │
│  { token: "..." }                                   │
│  Headers: Authorization: Bearer <jwt>               │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│  MfaAppService.completeRecovery()                   │
│                                                     │
│  1. Buscar RecoveryToken activo para el userId      │
│     → No encontrado o usado → INVALID_RECOVERY_TOKEN│
│     → Expirado → RECOVERY_TOKEN_EXPIRED             │
│                                                     │
│  2. Verificar hash del token (timingSafeEqual)      │
│     → No coincide → INVALID_RECOVERY_TOKEN          │
│                                                     │
│  3. Marcar token como usado                         │
│  4. disableMfa(userId)                              │
│     → Elimina todos los enrollments, backup codes,  │
│       trusted devices, recovery tokens, challenges  │
│                                                     │
│  → Response: 200 OK (MFA deshabilitado)             │
└─────────────────────────────────────────────────────┘
```

---

## Arquitectura Trusted Devices

```
┌─────────────────────────────────────────────────┐
│           TrustedDeviceDomainService             │
│                                                  │
│  trust(userId, deviceId)                         │
│   - Verificar si ya existe trust activo         │
│   - Crear TrustedDevice { id, userId, deviceId,  │
│     trustedAt, expiresAt(+30d), status:'active'}│
│   - ITrustedDeviceStore.save()                   │
│                                                  │
│  isTrusted(userId, deviceId)                     │
│   - Buscar por userId + deviceId                 │
│   - Verificar status === 'active'                │
│   - Verificar expiresAt > now                    │
│   - Si expirado → status='expired', update       │
│   - Return boolean                               │
│                                                  │
│  remove(userId, deviceId)                        │
│   - Buscar → NOT_FOUND si no existe             │
│   - status = 'revoked', update                   │
│                                                  │
│  cleanExpired()                                  │
│   - Marcar todos los expirados como 'expired'    │
│   - Return count                                 │
└─────────────────────────────────────────────────┘

Uso en autenticación (cuando se implemente):
  - Si trustedDevice.isTrusted(userId, deviceId)
    → saltar el challenge MFA (confianza)
  - Si no → generar challenge MFA
  - En login: si rememberDevice → trust device
```

---

## Estrategia Backup Codes

```
┌─────────────────────────────────────────────────┐
│           BackupCodeDomainService                │
│                                                  │
│  generateCodes(count = 10)                       │
│   - Por cada código:                             │
│     1. Generar string aleatorio de 10 chars      │
│        charset: ABCDEFGHJKLMNPQRSTUVWXYZ23456789 │
│        (no incluye 0, O, 1, I → legible)        │
│     2. SHA-256 hash → hex de 64 chars            │
│     3. BackupCode { id, hashedCode, used: false }│
│   - Devolver { plainCodes, hashedCodes }         │
│     (plainCodes SOLO una vez)                    │
│                                                  │
│  verifyCode(storedHash, providedCode)            │
│   - Valida formato (10 chars, charset correcto)  │
│   - timingSafeEqual(sha256(code), storedHash)    │
│                                                  │
│  formatCode(code)                                │
│   - Agrupar en segmentos de 5: ABCDE-FGHIJ-KLMNO│
│                                                  │
│  Validación en IBackupCodeStore:                  │
│   - findUnusedByUserId() → iterar, verificar     │
│   - Primera coincidencia → markUsed()            │
│   - Sin códigos disponibles → NO_BACKUP_CODES    │
└─────────────────────────────────────────────────┘
```

---

## Constantes

| Constante | Valor | Descripción |
|-----------|-------|-------------|
| `TOTP_SECRET_SIZE` | 20 | bytes del secreto |
| `TOTP_CODE_DIGITS` | 6 | dígitos del código |
| `TOTP_PERIOD_SECONDS` | 30 | período TOTP |
| `TOTP_ALGORITHM` | sha1 | HMAC algorithm |
| `TOTP_CLOCK_SKEW_STEPS` | 1 | ventana de tolerancia (±1 paso) |
| `BACKUP_CODE_COUNT` | 10 | cantidad de códigos generados |
| `BACKUP_CODE_LENGTH` | 10 | caracteres por código |
| `TRUSTED_DEVICE_TTL_DAYS` | 30 | días de confianza |
| `CHALLENGE_TTL_MINUTES` | 5 | min de expiración del challenge |
| `CHALLENGE_MAX_ATTEMPTS` | 3 | intentos máximos por challenge |
| `RECOVERY_TOKEN_TTL_HOURS` | 1 | hora de expiración del token |
| `RECOVERY_TOKEN_LENGTH` | 32 | bytes del token |
| `MAX_ENROLLED_METHODS` | 3 | métodos MFA simultáneos |

---

## Error Codes

| Código | HTTP | Causa |
|--------|------|-------|
| `MFA_NOT_ENABLED` | 403 | Operación requiere MFA y no está habilitado |
| `MFA_ALREADY_ENABLED` | 409 | Ya existe enrollment activo |
| `MFA_CHALLENGE_EXPIRED` | 401 | Challenge expiró (5 min) |
| `MFA_CHALLENGE_INVALID` | 401 | Challenge no encontrado o status incorrecto |
| `MFA_VERIFICATION_FAILED` | 401 | Código no coincide |
| `MFA_INVALID_TOTP_CODE` | 401 | Formato o valor TOTP inválido |
| `MFA_INVALID_BACKUP_CODE` | 401 | Backup code inválido |
| `MFA_BACKUP_CODE_ALREADY_USED` | 409 | Backup code ya usado |
| `MFA_NO_BACKUP_CODES` | 410 | No hay backup codes disponibles |
| `MFA_TRUSTED_DEVICE_EXPIRED` | 410 | Trust expiró |
| `MFA_TRUSTED_DEVICE_NOT_FOUND` | 404 | Device no encontrado |
| `MFA_INVALID_RECOVERY_TOKEN` | 401 | Token de recovery inválido |
| `MFA_RECOVERY_TOKEN_EXPIRED` | 401 | Token expiró |
| `MFA_SECRET_GENERATION_FAILED` | 500 | Error interno generando secreto |
| `MFA_CLOCK_DRIFT_DETECTED` | 401 | Clock skew fuera de rango |
| `MFA_METHOD_NOT_SUPPORTED` | 400 | Método MFA no soportado |
| `MFA_MAX_ATTEMPTS_EXCEEDED` | 429 | Demasiados intentos de verificación |
| `MFA_ENROLLMENT_NOT_FOUND` | 404 | Enrollment no encontrado |
| `MFA_METHOD_ALREADY_ENROLLED` | 409 | Método ya enrolado |

---

## Guards

| Guard | Propósito | Uso |
|-------|-----------|-----|
| `MfaGuard` | Verifica que el usuario tenga MFA habilitado | `@UseGuards(MfaGuard)` + `@MfaRequired()` |
| `MfaChallengeGuard` | Verifica challenge via headers | `@UseGuards(MfaChallengeGuard)` — lee `x-mfa-challenge-id`, `x-mfa-code` |

## Decorators

| Decorator | Propósito |
|-----------|-----------|
| `@MfaRequired()` | Marca endpoint como requiring MFA |
| `@CurrentMfa(field?)` | Extrae estado MFA del request (`verified`, `method`, `challengeId`) |

---

## Eventos

| Evento | Disparo |
|--------|---------|
| `MfaEnabledEvent` | `mfa.mfa.enabled` |
| `MfaDisabledEvent` | `mfa.mfa.disabled` |
| `MfaVerifiedEvent` | `mfa.mfa.verified` |
| `ChallengeCreatedEvent` | `mfa.challenge.created` |
| `MfaRecoveryStartedEvent` | `mfa.recovery.started` |
| `BackupCodeUsedEvent` | `mfa.backup_code.used` |
| `TrustedDeviceAddedEvent` | `mfa.trusted_device.added` |
| `TrustedDeviceRemovedEvent` | `mfa.trusted_device.removed` |

---

## Observabilidad

Logger registra (nunca secrets, TOTP secrets, backup codes ni recovery tokens):
- `mfa.enrolled` — método enrolado
- `mfa.disabled` — MFA deshabilitado
- `mfa.totp_verified` — TOTP verificado
- `mfa.backup_code_verified` — backup code usado
- `mfa.challenge_generated` — challenge creado (userId, method, challengeId)
- `mfa.challenge_verified` — challenge verificado
- `mfa.trusted_device_added` — device trust registrado
- `mfa.trusted_device_removed` — device trust removido
- `mfa.recovery_started` — recovery iniciado
- `mfa.recovery_completed` — recovery completado
- `mfa.method_disabled` — método específico deshabilitado
- `mfa.reset` — MFA reset completo

---

## Seguridad

| Requisito | Implementación |
|-----------|----------------|
| **RFC 6238** | TOTP con HMAC-SHA1, 30s period, 6 dígitos |
| **Replay Protection** | Challenge single-use + attempts tracking |
| **Clock Skew** | ±1 step (30s) de tolerancia |
| **Secure Secret Generation** | crypto.randomBytes(20) |
| **Constant Time Comparison** | timingSafeEqual para backup codes y recovery tokens |
| **Recovery Protection** | Token expira en 1h, single-use, hasheado |
| **Rate Limiting Hooks** | ChallengeMaxAttempts = 3, challenge se marca failed |
| **Secret Storage** | TOTP secret almacenado en enrollment (no vuelve a exponerse) |
| **Backup Code Storage** | Solo SHA-256 hash, nunca plain text |
| **Recovery Token Storage** | Solo hash, nunca plain text |

---

## Preparado para Futuro

| Feature | Punto de extensión |
|---------|-------------------|
| **Passkeys / WebAuthn / FIDO2** | Nuevo `MfaMethod` + `infrastructure/webauthn/` + `PresentationAssertionService` |
| **Hardware Keys** | `ITotpProvider` puede ser reemplazado por HSM-backed provider |
| **Email OTP** | Nuevo `MfaMethod` + `infrastructure/email-otp/` + `IEmailService` |
| **SMS OTP** | Nuevo `MfaMethod` + `infrastructure/sms-otp/` + `ISmsService` |
| **Push Approval** | Nuevo `MfaMethod` + `infrastructure/push/` + `IPushService` |
| **Biometric Login** | `MfaMethod` + `IBiometricProvider` |
| **Adaptive MFA** | Risk hooks en `MfaDomainService.generateChallenge()` |
| **Risk Based Auth** | `IMfaRiskEngine` inyectable en `MfaAppService` |

Ninguna de estas features requiere modificar el core del módulo MFA. Solo agregar:
1. Nuevo método en `MfaMethod` type
2. Provider específico implementando interfaz requerida
3. Store si es necesario
4. Validación en `MfaValidators`

---

## TypeScript

```
✓ TypeScript Strict
✓ 0 errores de compilación
✓ import type para decoradores (isolatedModules + emitDecoratorMetadata)
✓ Interfaces para todos los stores y providers
✓ Todas las dependencias inyectadas vía DI con string tokens
```

---

## Riesgos detectados

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| **TOTP secret en memoria** | Pérdida al reiniciar | InMemory → reemplazar con Redis/DB |
| **Backup codes en memoria** | Pérdida al reiniciar | InMemory → reemplazar con store persistente |
| **Clock skew extremo (>30s)** | Usuarios no pueden verificar | Aumentar TOTP_CLOCK_SKEW_STEPS |
| **Recovery token interceptado** | Account takeover | Token expira en 1h + solo se muestra una vez |
| **Sin límite de enrollments** | Abuso de recursos | MAX_ENROLLED_METHODS = 3 |
| **Trusted device sin fingerprint** | Falsos positivos | El deviceId lo provee el cliente (futuro: fingerprint) |
| **Rate limiting global** | Bruteforce TOTP | Solo implementado a nivel challenge |

---

## Recomendaciones

1. **Implementar RedisStores** para challenges, enrollments, backup codes, trusted devices, y recovery tokens (persistencia y escalabilidad).
2. **Agregar Rate Limiting global** por userId en verificación de TOTP (ej. max 10 intentos/min).
3. **Integrar con Authentication** — en el `login` flow, si MFA está enabled, devolver `mfaRequired: true` + `challengeId` (sin modificar auth core — usar guards).
4. **Agregar Device Fingerprinting** en el lado servidor para trusted devices reales.
5. **Implementar WebAuthn** como próximo factor — el módulo ya está preparado.
6. **Agregar endpoints REST** — el módulo expone guards, servicios y decorators, falta controller.
7. **Extender `MfaException`** desde `AppException` para integración con `GlobalExceptionFilter`.

---

## Integración con Authentication

El módulo MFA se integra con Authentication de la siguiente manera (sin modificar auth core):

```
// En el controller de login (futuro):
if (await mfaService.getState(user.userId).status === 'enabled') {
  const challenge = await mfaService.generateChallenge(user.userId, 'totp');
  throw new MfaChallengeRequiredException(challenge.id);
}

// Guard opcional para endpoints que requieren MFA:
@UseGuards(AuthenticationGuard, MfaGuard)
@MfaRequired()
@Get('/sensitive-data')
getSensitiveData() { ... }

// Challenge vía headers (para APIs):
// x-mfa-challenge-id + x-mfa-code
@UseGuards(MfaChallengeGuard)
@Post('/mfa/verify')
verifyMfa() { ... }
```
