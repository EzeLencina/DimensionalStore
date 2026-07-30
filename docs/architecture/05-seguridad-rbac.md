# SEGURIDAD, RBAC Y SISTEMA DE PERMISOS

> JWT · Refresh Tokens · RBAC · Permisos Granulares · Rate Limiting · Auditoría

---

## 1. Estrategia de Autenticación

### JWT + Refresh Tokens

```
Flujo de autenticación:

┌─────────┐         ┌──────────┐         ┌───────────┐
│ Cliente │         │ Backend  │         │  Redis    │
└────┬────┘         └────┬─────┘         └─────┬─────┘
     │                   │                     │
     │  POST /auth/login │                     │
     │  {email, password}│                     │
     ├──────────────────►│                     │
     │                   │  Validar credenciales│
     │                   │  (bcrypt compare)   │
     │                   │                     │
     │                   │  Generar Access Token│
     │                   │  (JWT, 15 min)       │
     │                   │                      │
     │                   │  Generar Refresh     │
     │                   │  Token (opaco, 7d)   │
     │                   ├──────────►           │
     │                   │  Guardar en Redis    │
     │                   │  (key: refresh:{uid})│
     │                   │◄──────────           │
     │  {accessToken,    │                     │
     │   refreshToken}   │                     │
     │◄──────────────────┤                     │
     │                   │                     │
     │  GET /api/recurso │                     │
     │  Authorization:   │                     │
     │  Bearer {access}  │                     │
     ├──────────────────►│                     │
     │                   │  Validar JWT (firma,│
     │                   │  expiración, tenant) │
     │                   │  → user_id, role    │
     │   200 OK          │                     │
     │◄──────────────────┤                     │
```

### Token Structure

```typescript
// Access Token (JWT)
interface AccessTokenPayload {
  sub: string;           // user_id
  email: string;
  role: string;
  tenantId: string;
  permissions: string[]; // Flat list for fast check
  iat: number;
  exp: number;
}

// Refresh Token (opaco, UUID-based)
interface RefreshTokenPayload {
  id: string;            // UUID
  userId: string;
  tenantId: string;
  family: string;        // Token family (rotación)
}
```

### Rotación de Refresh Tokens

```
Cada uso de refresh token:
  1. Invalidar refresh token anterior en Redis
  2. Generar nuevo refresh token (misma familia)
  3. Generar nuevo access token

Si un refresh token ya usado se reutiliza:
  → Sospecha de robo: invalidar TODA la familia
  → Forzar logout del usuario en todos los dispositivos
```

---

## 2. RBAC + Permisos Granulares

### Arquitectura

```
USERS ──── N:N ──── ROLES ──── N:N ──── PERMISSIONS
  │                                              │
  │                                              │
  └─────────────── PERMISSION_OVERRIDES ─────────┘
                    (user-specific overrides)
```

### Permisos Definidos (por módulo)

```typescript
// packages/shared/src/constants/permissions.ts
export const Permissions = {
  // Catalog
  'catalog:read':      'Ver productos',
  'catalog:create':    'Crear productos',
  'catalog:update':    'Modificar productos',
  'catalog:delete':    'Eliminar productos',
  'catalog:import':    'Importar productos',
  'catalog:export':    'Exportar productos',
  'catalog:manage-price': 'Gestionar precios',

  // Inventory
  'inventory:read':        'Ver stock',
  'inventory:adjust':      'Ajustar stock',
  'inventory:transfer':    'Transferir stock',
  'inventory:configure':   'Configurar alertas',
  'inventory:view-movements': 'Ver movimientos',

  // Orders
  'orders:read':          'Ver órdenes',
  'orders:create':        'Crear órdenes (checkout)',
  'orders:update-status': 'Cambiar estado de órdenes',
  'orders:cancel':        'Cancelar órdenes',
  'orders:refund':        'Reembolsar órdenes',
  'orders:view-all':      'Ver todas las órdenes (no solo propias)',

  // Purchases
  'purchases:read':        'Ver compras',
  'purchases:create':      'Crear órdenes de compra',
  'purchases:receive':     'Recibir mercadería',
  'purchases:cancel':      'Cancelar compras',

  // CRM
  'crm:read':             'Ver clientes',
  'crm:create':           'Crear clientes',
  'crm:update':           'Modificar clientes',
  'crm:delete':           'Eliminar clientes',
  'crm:export':           'Exportar clientes',

  // Finances
  'finances:read':             'Ver finanzas',
  'finances:open-register':    'Abrir caja',
  'finances:close-register':   'Cerrar caja',
  'finances:register-payment': 'Registrar pago',
  'finances:register-expense': 'Registrar egreso',
  'finances:generate-invoice': 'Generar factura',
  'finances:view-reports':     'Ver reportes financieros',
  'finances:view-profitability': 'Ver rentabilidad',

  // CMS
  'cms:read':             'Ver páginas',
  'cms:create':           'Crear páginas',
  'cms:update':           'Modificar páginas',
  'cms:publish':          'Publicar páginas',

  // Marketing
  'marketing:read':        'Ver cupones/campañas',
  'marketing:create':      'Crear cupones/campañas',
  'marketing:update':      'Modificar cupones/campañas',
  'marketing:delete':      'Eliminar cupones',

  // Reports
  'reports:view':          'Ver reportes',
  'reports:export':        'Exportar reportes',
  'reports:view-financial': 'Ver reportes financieros',

  // Configuration
  'config:read':           'Ver configuración',
  'config:update':         'Modificar configuración',

  // Users & Roles
  'users:read':            'Ver usuarios',
  'users:create':          'Crear usuarios',
  'users:update':          'Modificar usuarios',
  'users:deactivate':      'Desactivar usuarios',
  'roles:read':            'Ver roles',
  'roles:create':          'Crear roles',
  'roles:update':          'Modificar roles',
  'roles:delete':          'Eliminar roles',

  // Integrations
  'integrations:read':     'Ver integraciones',
  'integrations:manage':   'Gestionar integraciones',
  'integrations:webhooks': 'Gestionar webhooks',
} as const;
```

### Roles por Defecto

```typescript
export const DefaultRoles = {
  ADMIN: {
    name: 'Administrador',
    description: 'Acceso completo al sistema',
    permissions: Object.keys(Permissions), // Todos los permisos
    isSystem: true,
  },
  SELLER: {
    name: 'Vendedor',
    description: 'Gestión de ventas y clientes',
    permissions: [
      'catalog:read',
      'orders:read',
      'orders:create',
      'orders:update-status',
      'crm:read',
      'crm:create',
      'crm:update',
      'inventory:read',
      'finances:open-register',
      'finances:close-register',
      'finances:register-payment',
      'reports:view',
    ],
    isSystem: true,
  },
  ACCOUNTANT: {
    name: 'Contador',
    description: 'Acceso a finanzas y reportes',
    permissions: [
      'orders:read',
      'finances:*',     // Wildcard para todo finanzas
      'reports:*',
      'catalog:read',
      'inventory:read',
    ],
    isSystem: true,
  },
  // FUTURO: roles personalizados desde el panel admin
};
```

### Implementación de Guards

```typescript
// modules/auth/presentation/guards/permissions.guard.ts
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    @Inject('PermissionValidator')
    private permissionValidator: PermissionValidatorService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermissions) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return this.permissionValidator.hasPermissions(
      user.permissions,
      requiredPermissions,
    );
  }
}

// Uso en controlador
@Post()
@Permissions('catalog:create')
@UseGuards(JwtAuthGuard, PermissionsGuard)
async createProduct(@Body() dto: CreateProductDTO) { ... }
```

### Permission Validator (Domain Service)

```typescript
// modules/roles/domain/services/permission-validator.service.ts
export class PermissionValidatorService {
  hasPermissions(
    userPermissions: string[],
    requiredPermissions: string[],
  ): boolean {
    return requiredPermissions.every((required) =>
      userPermissions.some((userPerm) => this.match(userPerm, required)),
    );
  }

  private match(userPermission: string, required: string): boolean {
    // Soporte para wildcard: 'finances:*' matchea 'finances:read', 'finances:create', etc.
    if (userPermission.endsWith(':*')) {
      const module = userPermission.split(':')[0];
      return required.startsWith(module);
    }
    return userPermission === required;
  }
}
```

---

## 3. Rate Limiting

```typescript
// Configuración global
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,          // 1 segundo
        limit: 10,          // 10 requests
      },
      {
        name: 'medium',
        ttl: 60000,         // 1 minuto
        limit: 100,
      },
      {
        name: 'long',
        ttl: 3600000,       // 1 hora
        limit: 1000,
      },
    ]),
  ],
})
```

### Límites por Endpoint

| Endpoint | Límite | Medida |
|----------|--------|--------|
| `/auth/login` | 5/min | Anti brute force |
| `/auth/register` | 3/hora | Anti creación masiva |
| `/api/*` (general) | 100/min | Protección general |
| `/api/reports/*` | 10/min | Reportes pesados |
| `/api/webhooks/*` | 200/min | Integraciones |
| Público (shop) | 50/min | Sin autenticar |
| Admin | 200/min | Autenticado |

---

## 4. Cabeceras de Seguridad (Helmet)

```typescript
// main.ts
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // necesario para Next.js
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'https://*.r2.cloudflarestorage.com', 'data:'],
      connectSrc: ["'self'", process.env.API_URL],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
  },
}));
```

---

## 5. CORS

```typescript
app.enableCors({
  origin: [
    'https://midominio.com',
    'https://admin.midominio.com',
    /\.midominio\.com$/,  // Multi-tenant: *.midominio.com
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-Slug'],
  credentials: true,
  maxAge: 86400,  // Preflight cache: 24h
});
```

---

## 6. Auditoría

### Estrategia

```
Cada modificación de datos de negocio genera un registro de auditoría.

Qué se audita:
  - Creación, modificación y eliminación de entidades
  - Cambios de estado en órdenes
  - Cambios de precio
  - Inicios de sesión
  - Cambios de rol/permisos
  - Exportaciones de datos

Qué NO se audita:
  - Lecturas (GET)
  - Consultas de catálogo público
  - Errores de validación de formulario
```

### Implementación

```typescript
// common/interceptors/audit.interceptor.ts
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    @InjectQueue('audit') private auditQueue: Queue,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // Solo auditar mutaciones
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        const user = request.user;
        const tenant = request.tenant;

        this.auditQueue.add('log-entry', {
          tenantId: tenant?.id,
          userId: user?.id,
          action: `${request.routeOptions?.path?.replace('/api/v1/', '')}:${method}`,
          entityType: this.extractEntityType(request.routeOptions?.path),
          entityId: request.params?.id || request.body?.sku,
          metadata: {
            path: request.routeOptions?.path,
            method,
            body: this.sanitizeBody(request.body),
          },
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
        });
      }),
    );
  }
}
```

---

## 7. Validación

### Capas de Validación

```
Capa 1: DTO Validation (NestJS Pipes + Zod)
  - Tipos, formatos, rangos
  - Ocurre en el controller

Capa 2: Domain Validation (Value Objects)
  - Reglas de negocio (SKU formato, precio > 0)
  - Ocurre en el Domain Layer

Capa 3: Application Validation (Command Handlers)
  - Reglas de negocio entre entidades (stock suficiente para vender)
  - Ocurre en el Application Layer

Capa 4: Database Constraints (Prisma + PostgreSQL)
  - Unicidad, FKs, checks
  - Última línea de defensa
```

### Ejemplo: Validation Pipe Global

```typescript
// common/pipes/validation.pipe.ts
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Error de validación',
          details: result.error.flatten().fieldErrors,
        },
      });
    }
    return result.data;
  }
}
```

---

## 8. Protección de Datos Sensibles

```typescript
// core/infrastructure/security/encryption.service.ts
@Injectable()
export class EncryptionService {
  // Encriptación para datos sensibles en la DB (ej: API keys de integraciones)
  encrypt(text: string): string {
    const cipher = createCipheriv('aes-256-gcm', this.key, this.iv);
    // ...
  }

  decrypt(encrypted: string): string {
    // ...
  }
}
```

---

## 9. Resumen de Capas de Seguridad

| Capa | Medida | Implementación |
|------|--------|---------------|
| **Transporte** | TLS 1.3 + HSTS | Nginx/CDN |
| **Network** | DDoS Protection, WAF | Cloudflare |
| **API** | Rate Limiting, CORS, Helmet | NestJS middleware |
| **Auth** | JWT + Refresh Tokens + bcrypt | Auth Module |
| **Autorización** | RBAC + Permisos Granulares | Roles Module + Guards |
| **Validación** | Zod + DTOs + Domain Rules | Pipes + Value Objects |
| **Datos** | RLS Multi-tenant + Encriptación | PostgreSQL + EncryptionService |
| **Auditoría** | Audit Log + Trazabilidad | AuditInterceptor + BullMQ |
| **Infra** | Secrets (env), no hardcode | .env + Vault (futuro) |
| **Dependencias** | Dependabot, audit semanal | GitHub Actions |
