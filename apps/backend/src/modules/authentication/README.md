# Módulo Authentication

Núcleo de autenticación del sistema. Desacoplado, extensible, preparado para OAuth2/OIDC/MFA en fases posteriores.

---

## Árbol completo

```
modules/authentication/
├── index.ts                                     # Barrel público del módulo
├── authentication.module.ts                     # Módulo NestJS con DI completo
├── README.md
│
├── domain/                                      # ── Capa de dominio (DDD) ──
│   ├── index.ts
│   ├── types/
│   │   └── index.ts                             # TokenType, TokenPayload, TokenPair, SessionInfo, LoginResult, PasswordPolicy
│   ├── value-objects/
│   │   ├── password-hash.value-object.ts        # Hash de contraseña inmutable
│   │   ├── token-id.value-object.ts             # UUID v4 para tokens
│   │   ├── session-id.value-object.ts           # UUID v4 para sesiones
│   │   └── index.ts
│   ├── exceptions/
│   │   ├── authentication.exception.ts          # AuthenticationException + AUTH_ERROR_CODES (17 códigos)
│   │   └── index.ts
│   ├── events/
│   │   ├── domain-event.ts                      # Base abstract DomainEvent
│   │   ├── user-logged-in.event.ts              # Disparado en login exitoso
│   │   ├── user-logged-out.event.ts             # Disparado en logout
│   │   ├── token-generated.event.ts             # Disparado al generar tokens
│   │   ├── token-revoked.event.ts               # Disparado al revocar tokens
│   │   ├── password-verified.event.ts           # Disparado al verificar contraseña
│   │   ├── authentication-failed.event.ts       # Disparado en login fallido
│   │   └── index.ts
│   └── services/
│       ├── password-domain.service.ts           # Validación de fortaleza de contraseña (PasswordPolicy)
│       └── index.ts
│
├── application/                                 # ── Capa de aplicación (puertos) ──
│   ├── index.ts
│   ├── interfaces/
│   │   ├── authentication-service.interface.ts  # IAuthenticationService — login, logout, refresh, validate, bootstrap
│   │   ├── token-service.interface.ts           # ITokenService — generate, verify, decode
│   │   ├── hashing-service.interface.ts         # IHashingService — hash, verify
│   │   ├── session-repository.interface.ts      # ISessionRepository — CRUD sesiones
│   │   └── index.ts
│   ├── commands/
│   │   ├── login.command.ts                     # LoginCommand(email, password, ip?, userAgent?)
│   │   ├── logout.command.ts                    # LogoutCommand(userId, sessionId)
│   │   ├── refresh-token.command.ts             # RefreshTokenCommand(refreshToken)
│   │   ├── validate-credentials.command.ts      # ValidateCredentialsCommand(email, password)
│   │   └── index.ts
│   ├── dto/
│   │   └── index.ts                             # LoginRequestDto, LoginResponseDto, TokenPairDto, etc.
│   └── validators/
│       ├── authentication.validators.ts         # isValidEmail, isValidPassword, isValidRefreshToken, isValidSessionId
│       └── index.ts
│
├── infrastructure/                              # ── Infraestructura (adapters) ──
│   ├── index.ts
│   ├── hashing/
│   │   ├── argon2-hashing.service.ts            # Argon2id — hash + verify
│   │   └── index.ts
│   ├── jwt/
│   │   ├── jwt-config.service.ts                # JwtConfigService — ConfigService wrapper
│   │   ├── jwt-token.service.ts                 # JwtTokenService — sign/verify access + refresh tokens
│   │   └── index.ts
│   ├── tokens/
│   │   ├── token-rotation.service.ts            # TokenRotationService — rotación + detección de reuso
│   │   ├── token-blacklist.service.ts           # TokenBlacklistService — revocación + cleanup
│   │   └── index.ts
│   └── repositories/
│       ├── session.repository.ts                # InMemorySessionRepository — implementación volátil
│       └── index.ts
│
├── presentation/                                # ── Capa de presentación (NestJS) ──
│   ├── index.ts
│   ├── guards/
│   │   ├── auth.guard.ts                        # AuthenticationGuard — JWT + @Public()
│   │   ├── optional-auth.guard.ts               # OptionalAuthenticationGuard — no lanza error si falta token
│   │   └── index.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts                      # JwtAuthStrategy — Bearer JWT (passport-jwt)
│   │   ├── local.strategy.ts                    # LocalAuthStrategy — email+password (passport-local)
│   │   ├── bearer.strategy.ts                   # BearerStrategy — Bearer token alternativo
│   │   └── index.ts
│   └── decorators/
│       ├── public.decorator.ts                  # @Public() — marca ruta como pública
│       ├── current-user.decorator.ts            # @CurrentUser() — extrae user del request
│       └── index.ts
│
├── services/                                    # ── Servicios de aplicación ──
│   ├── authentication.service.ts                # AuthenticationService — orquestador del core
│   ├── authentication.factory.ts                # AuthenticationFactory — registro de proveedores (local, future OAuth)
│   └── index.ts
│
├── providers/                                   # ── DI Providers ──
│   ├── authentication.providers.ts              # AUTHENTICATION_PROVIDERS — wiring de interfaces a implementaciones
│   └── index.ts
│
├── events/                                      # ── Event handlers ──
│   ├── authentication-event.handler.ts          # AuthenticationEventHandler — logs estructurados
│   └── index.ts
│
├── exceptions/
│   ├── http-exception.filter.ts                 # AuthenticationExceptionFilter — mapea códigos a HTTP status
│   └── index.ts
│
├── validators/
│   ├── class.validators.ts                      # Funciones validadoras: password strength, email, jwt, timezone
│   └── index.ts
│
├── constants/
│   ├── authentication.constants.ts              # AUTH_CONSTANTS — expiraciones, límites, política
│   └── index.ts
│
├── commands/
│   └── index.ts                                 # Re-export de LoginCommand, LogoutCommand, RefreshTokenCommand
│
├── queries/
│   └── index.ts                                 # GetSessionQuery, GetUserSessionsQuery (preparado)
│
├── hashing/
│   └── index.ts                                 # Re-export de Argon2HashingService
│
├── password/
│   └── index.ts                                 # Re-export de PasswordDomainService
│
├── tokens/
│   └── index.ts                                 # Re-export de TokenRotationService, TokenBlacklistService
│
├── repositories/
│   └── index.ts                                 # Re-export de InMemorySessionRepository + ISessionRepository
│
├── interfaces/
│   └── index.ts                                 # Re-export de todas las interfaces de aplicación
│
└── types/
    └── index.ts                                 # Express User augmentation
```

---

## Flujo Login

```
Cliente                     AuthenticationService          IdentityModule
   │                               │                            │
   ├─ POST /auth/login ──────────► │                            │
   │   {email, password}           │                            │
   │                               │                            │
   │                        ┌──────┴──────┐                    │
   │                        │ Validar      │                    │
   │                        │ email        │                    │
   │                        │ + password   │                    │
   │                        └──────┬──────┘                    │
   │                               │                           │
   │                        ┌──────┴──────┐                    │
   │                        │ HashService │                    │
   │                        │ .verify()   │                    │
   │                        └──────┬──────┘                    │
   │                               │                           │
   │                        ┌──────┴──────┐                    │
   │                        │ Crear       │                    │
   │                        │ SessionId   │                    │
   │                        └──────┬──────┘                    │
   │                               │                           │
   │                        ┌──────┴──────┐                    │
   │                        │ Session     │                    │
   │                        │ Repository  │                    │
   │                        │ .save()     │                    │
   │                        └──────┬──────┘                    │
   │                               │                           │
   │                        ┌──────┴──────┐                    │
   │                        │ TokenService│                    │
   │                        │ .generate   │                    │
   │                        │ TokenPair() │                    │
   │                        └──────┬──────┘                    │
   │                               │                           │
   │                        ┌──────┴──────┐                    │
   │                        │ Logger:     │                    │
   │                        │ login_success│                    │
   │                        └──────┬──────┘                    │
   │                               │                           │
   │◄──────────────────────────────┘                           │
   │   {accessToken, refreshToken,                             │
   │    sessionId, expiresAt}                                  │
```

---

## Flujo Refresh

```
Cliente                     AuthenticationService          TokenRotation
   │                               │                            │
   ├─ POST /auth/refresh ─────────► │                            │
   │   {refreshToken}               │                            │
   │                               │                            │
   │                        ┌──────┴──────┐                    │
   │                        │ TokenService │                    │
   │                        │ .verify()    │                    │
   │                        │ (refresh)    │                    │
   │                        └──────┬──────┘                    │
   │                               │                           │
   │                        ┌──────┴──────┐                    │
   │                        │ Blacklist?  │                    │
   │                        │ .isBlack    │                    │
   │                        │ listed()    │                    │
   │                        └──────┬──────┘                    │
   │                               │                           │
   │                        ┌──────┴──────┐                    │
   │                        │ Rotation?   │                    │
   │                        │ .isReused() ├── si reusado ───►  │
   │                        └──────┬──────┘  revocar sesiones │
   │                               │                           │
   │                        ┌──────┴──────┐                    │
   │                        │ Session     │                    │
   │                        │ Repository  │                    │
   │                        │ .findById() │                    │
   │                        └──────┬──────┘                    │
   │                               │                           │
   │                        ┌──────┴──────┐                    │
   │                        │ Generar     │                    │
   │                        │ nuevo par   │                    │
   │                        │ de tokens   │                    │
   │                        └──────┬──────┘                    │
   │                               │                           │
   │                        ┌──────┴──────┐                    │
   │                        │ Blacklist:  │                    │
   │                        │ add(old)    │                    │
   │                        └──────┬──────┘                    │
   │                               │                           │
   │◄──────────────────────────────┘                           │
```

---

## Flujo Logout

```
Cliente                     AuthenticationService          SessionRepo
   │                               │                            │
   ├─ POST /auth/logout ──────────► │                            │
   │   Authorization: Bearer ...    │                            │
   │   {sessionId}                  │                            │
   │                               │                            │
   │                        ┌──────┴──────┐                    │
   │                        │ Validar      │                    │
   │                        │ sessionId    │                    │
   │                        └──────┬──────┘                    │
   │                               │                           │
   │                        ┌──────┴──────┐                    │
   │                        │ Session     │                    │
   │                        │ Repo        │                    │
   │                        │ .findById() ├──► existe?         │
   │                        └──────┬──────┘                    │
   │                               │                           │
   │                        ┌──────┴──────┐                    │
   │                        │ Session     │                    │
   │                        │ Repo        │                    │
   │                        │ .delete()   ├──► eliminado       │
   │                        └──────┬──────┘                    │
   │                               │                           │
   │                        Logger: auth.logout                │
   │                               │                           │
   │◄──────────────────────────────┘                           │
   │   {success: true, message: "Logged out"}                  │
```

---

## Arquitectura JWT

```
┌─────────────────────────────────────────────────────────────┐
│                      JwtConfigService                       │
│  secret:     JWT_SECRET (env)                               │
│  expiresIn:  JWT_EXPIRES_IN (default: 15m)                 │
│  refreshSecret:  JWT_REFRESH_SECRET (env)                   │
│  refreshExpiresIn: JWT_REFRESH_EXPIRES_IN (default: 7d)    │
│  issuer:     'tienda'                                       │
│  audience:   'tienda-api'                                   │
│  clockSkew:  30s                                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       Access Token                          │
│  sub:       userId (UUID)                                   │
│  email:     user email                                      │
│  type:      'access'                                        │
│  jti:       tokenId (UUID)                                  │
│  sessionId: UUID                                            │
│  iat:       issued at                                       │
│  exp:       expires at (15m)                                │
│  iss:       'tienda'                                        │
│  aud:       'tienda-api'                                    │
│  Firmado con: JWT_SECRET                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      Refresh Token                          │
│  sub:       userId (UUID)                                   │
│  email:     user email                                      │
│  type:      'refresh'                                       │
│  jti:       tokenId (UUID)                                  │
│  sessionId: UUID                                            │
│  iat:       issued at                                       │
│  exp:       expires at (7d)                                 │
│  iss:       'tienda'                                        │
│  aud:       'tienda-api'                                    │
│  Firmado con: JWT_REFRESH_SECRET                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Estrategia Password Hashing

```
┌─────────────────────────────────────────────────────────────┐
│                    Argon2HashingService                     │
│  Algoritmo: Argon2id                                        │
│  Memory:    19,456 KiB (19 MiB)                             │
│  Iterations: 2                                              │
│  Parallelism: 1                                             │
│  Salt:       generado automáticamente (16 bytes cripto-RNG) │
│  Output:     $argon2id$v=19$m=19456,t=2,p=1$...            │
└─────────────────────────────────────────────────────────────┘

Características:
- Argon2id es resistente a side-channel y GPU attacks
- Cost parameters configurables via constructor
- Constant-time verification (no timing leaks)
- Salt automático e incluye en el hash output
```

---

## Estrategia Token Rotation

```
Refresh Token recibido
        │
        ▼
┌─────────────────┐
│ ¿Token          │
│ blacklisted?    ├── Sí → 401 AUTH_TOKEN_REVOKED
└────────┬────────┘
         │ No
         ▼
┌─────────────────┐
│ ¿Token reusado? ├── Sí → Revocar TODAS las sesiones
└────────┬────────┘         del usuario (respuesta a robo)
         │ No
         ▼
┌─────────────────┐
│ Generar NUEVO   │
│ par de tokens   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Blacklistear    │
│ refresh anterior│
└────────┬────────┘
         │
         ▼
      Devolver nuevo par
```

---

## Riesgos detectados

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| **Reuso de refresh token** | Robo de sesión | TokenRotationService detecta reuso y revoca todas las sesiones |
| **Token sin expirar** | Ventana de ataque amplia | Access token 15m, refresh token 7d |
| **Clock skew** | Rechazo falso positivo | 30s de tolerancia configurable |
| **Contraseña débil** | Fuerza bruta | PasswordDomainService con política (8+ chars, mayúscula, número, especial) |
| **Logging de secretos** | Exposición de credenciales | Logger nunca registra passwords/hashes/tokens/secrets |
| **InMemorySessionRepository** | Pérdida de sesiones | Provisoria: debe reemplazarse por Redis/Prisma en producción |
| **Sin rate limiting** | Fuerza bruta | Hooks preparados (RateLimiting hooks) |
| **Replay de tokens** | Replay attack | jti (JWT ID) único por token + blacklist |

---

## Recomendaciones

1. **Reemplazar InMemorySessionRepository** por implementación Redis o Prisma antes de producción.

2. **Conectar EventBus** al `AuthenticationEventHandler` para publicar eventos reales.

3. **Extender AuthenticationException** desde `AppException` para integración con `GlobalExceptionFilter`.

4. **Agregar rate limiting** en el controlador de login (usar `@nestjs/throttler` ya disponible).

5. **Configurar JWT_SECRET y JWT_REFRESH_SECRET** como variables de entorno seguras (nunca los defaults).

6. **Implementar PrismaUserRepository** para el método `validateCredentials` (actualmente retorna stub).

7. **Agregar rotación programada** del `TokenBlacklistService.cleanup()` mediante cron o setInterval.

8. **Preparar controladores HTTP** en una fase posterior exponiendo `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh`.

---

## Tokens preparados para futuro

| Token | Estado | Uso |
|-------|--------|-----|
| Access Token | ✅ Implementado | Autenticación de requests |
| Refresh Token | ✅ Implementado | Rotación de sesión |
| Password Reset Token | 🔧 Preparado | Restablecimiento de contraseña (futuro) |
| Email Verification Token | 🔧 Preparado | Verificación de email (futuro) |
| Magic Link Token | 🔧 Tipo definido | Login sin contraseña (futuro) |
| API Token | 🔧 Tipo definido | Acceso programático (futuro) |

---

## Estrategias implementadas

| Estrategia | Provider | Uso |
|------------|----------|-----|
| JWT Strategy | passport-jwt | Guard principal |
| Local Strategy | passport-local | Login con credenciales |
| Bearer Strategy | passport-jwt | API token alternativo |
| OAuth2 | — | Preparado, no implementado |
| Google/GitHub/Apple | — | Preparado, no implementado |

---

## Observabilidad

Eventos registrados (Logger — nunca passwords/hashes/tokens/secrets):
- `auth.login_success` — login exitoso
- `auth.login_failed` — credenciales inválidas
- `auth.refresh` — refresh token exitoso
- `auth.logout` — logout exitoso
- `auth.token_reuse_detected` — intento de reuso detectado
- `auth.session_bootstrap` — sesión bootstrapeada
- `auth.event.*` — eventos de dominio

---

## TypeScript

```
✓ TypeScript Strict
✓ 0 errores de compilación
✓ 0 dependencias circulares
✓ Todas las interfaces desacopladas
✓ Injection tokens para todas las dependencias
```

---

## Dependencias instaladas

- `argon2` — Argon2id hashing
- `passport-local` — Estrategia local
- `@types/passport-local` — Types

Dependencias existentes reutilizadas:
- `@nestjs/jwt` — JWT signing/verification
- `@nestjs/passport` — Passport integration
- `passport` / `passport-jwt` — JWT strategy
- `@tienda/logger/nest` — Logger estructurado
- `@nestjs/config` — ConfigService + jwt config namespace
