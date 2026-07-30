# Product Domain Module

## Purpose
Implements the core Product domain aggregate with full DDD, multi-tenant isolation, and clean architecture. This is the foundation for all product-related features (catalog, inventory, pricing, variants, etc.).

## Architecture
```
products/
├── constants/          # Module constants
├── domain/             # DDD Domain Layer
│   ├── aggregates/     # Product aggregate root
│   ├── value-objects/  # Immutable VOs (ProductName, ProductSlug, etc.)
│   ├── events/         # Domain events
│   ├── exceptions/     # ProductException + error codes
│   ├── repositories/   # IProductRepository port
│   └── specifications/ # Reusable specifications
├── application/        # Application Layer
│   ├── commands/       # CQRS commands
│   ├── dto/            # Request/Response DTOs
│   ├── interfaces/     # IProductService port
│   ├── validators/     # ProductValidators (Zod-compatible)
│   └── mappers/        # Domain ↔ Response mapping
├── infrastructure/     # Infrastructure Layer
│   └── persistence/    # PrismaProductRepository
├── presentation/       # Presentation Layer
│   └── controllers/    # ProductController (REST)
├── services/           # ProductAppService (orchestrator)
├── providers/          # DI providers with string tokens
├── events/             # Event handlers (logging)
├── exceptions/         # HTTP exception filter
└── validators/         # Re-exported validators
```

## Aggregate: Product
The `Product` aggregate root represents a commercial product. It encapsulates:
- Identity, naming, and slug
- Status lifecycle (DRAFT → ACTIVE → INACTIVE → ARCHIVED)
- Visibility (PUBLIC, PRIVATE, HIDDEN)
- Condition (NEW, REFURBISHED, USED)
- Product type (PHYSICAL, DIGITAL, SERVICE, BUNDLE)
- Warranty period
- SEO metadata
- Multi-tenant isolation (tenantId)
- Soft delete
- Optimistic concurrency (version)
- Domain events

### Value Objects
| VO | Validation |
|---|---|
| ProductId | Non-empty string or auto-generated UUID |
| ProductName | 2-255 chars, space-normalized |
| ProductSlug | Lowercase letters, numbers, hyphens; max 255 |
| ShortDescription | Max 500 chars |
| ProductDescription | Max 10000 chars |
| SeoTitle | Max 70 chars |
| SeoDescription | Max 160 chars |
| WarrantyPeriod | 0-120 months or null |
| ProductStatus | DRAFT, ACTIVE, INACTIVE, ARCHIVED |
| ProductVisibility | PUBLIC, PRIVATE, HIDDEN |
| ProductCondition | NEW, REFURBISHED, USED |
| ProductType | PHYSICAL, DIGITAL, SERVICE, BUNDLE |

### Status Transitions
```
DRAFT ───→ ACTIVE
DRAFT ───→ ARCHIVED
ACTIVE ──→ INACTIVE
ACTIVE ──→ ARCHIVED
INACTIVE → ACTIVE
INACTIVE → ARCHIVED
ARCHIVED → DRAFT (restore)
```

### Domain Events
- `ProductCreated` — on creation
- `ProductRenamed` — on rename
- `ProductActivated` — on activate
- `ProductDeactivated` — on deactivate
- `ProductArchived` — on archive
- `ProductRestored` — on restore from archive
- `ProductVisibilityChanged` — on visibility change
- `ProductSeoUpdated` — on SEO update
- `ProductDeleted` — on soft delete

### Invariants
1. Name is required, space-normalized
2. Slug is required, unique per tenant
3. Archived products cannot be published
4. Deleted products cannot be modified
5. Active products require valid name + slug
6. Tenant identity is immutable
7. Warranty is non-negative
8. Status transitions pass through domain methods only
9. Changes update updatedAt
10. Version is incremented on each save

## Use Cases
| Use Case | Command | Endpoint |
|---|---|---|
| Create product | CreateProductCommand | POST /api/v1/products |
| Get by ID | — | GET /api/v1/products/:id |
| Get by slug | — | GET /api/v1/products/slug/:slug |
| Update basic info | UpdateProductCommand | PATCH /api/v1/products/:id |
| Change status | ChangeProductStatusCommand | PATCH /api/v1/products/:id/status |
| Change visibility | ChangeProductVisibilityCommand | PATCH /api/v1/products/:id/visibility |
| Archive | ArchiveProductCommand | POST /api/v1/products/:id/archive |
| Restore | RestoreProductCommand | POST /api/v1/products/:id/restore |
| List | — | GET /api/v1/products |

## Endpoints
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/v1/products | products.create | Create product |
| GET | /api/v1/products/:id | products.read | Get by ID |
| GET | /api/v1/products/slug/:slug | products.read | Get by slug |
| PATCH | /api/v1/products/:id | products.update | Update product |
| PATCH | /api/v1/products/:id/status | products.update | Change status |
| PATCH | /api/v1/products/:id/visibility | products.update | Change visibility |
| POST | /api/v1/products/:id/archive | products.archive | Archive product |
| POST | /api/v1/products/:id/restore | products.restore | Restore product |
| GET | /api/v1/products | products.read | List products |

## Permissions
| Permission | Description | Default Roles |
|---|---|---|
| products.create | Create products | Admin |
| products.read | View products | Admin, Seller |
| products.update | Update products | Admin |
| products.archive | Archive products | Admin |
| products.restore | Restore products | Admin |
| products.manage | Full management | Admin |

## Multi-Tenant Isolation
- All queries are filtered by `tenantId`
- `tenantId` is resolved from the authenticated context, never from client input
- Slug uniqueness is enforced per tenant (composite unique constraint)
- Cross-tenant access is impossible at the repository level

## Persistence Model
**Table:** `products`

| Column | Type | Constraints |
|---|---|---|
| id | TEXT | PK, default cuid |
| tenantId | TEXT | NOT NULL, indexed |
| organizationId | TEXT | Nullable |
| name | TEXT | NOT NULL |
| slug | TEXT | NOT NULL |
| shortDescription | TEXT | Nullable |
| description | TEXT | Nullable |
| productType | ProductType enum | DEFAULT PHYSICAL |
| status | ProductStatus enum | DEFAULT DRAFT |
| visibility | ProductVisibility enum | DEFAULT PUBLIC |
| condition | ProductCondition enum | DEFAULT NEW |
| warrantyMonths | INTEGER | Nullable |
| seoTitle | TEXT | Nullable |
| seoDescription | TEXT | Nullable |
| deletedAt | TIMESTAMP | Nullable |
| version | INTEGER | DEFAULT 1 |
| createdAt | TIMESTAMP | DEFAULT now() |
| updatedAt | TIMESTAMP | Auto-updated |

**Unique:** (tenantId, slug)
**Indexes:** tenantId, (tenantId, status), (tenantId, visibility), (tenantId, createdAt), (tenantId, updatedAt), (tenantId, deletedAt)

## Testing Strategy
- **Unit tests:** 77 tests covering all VOs, aggregate behaviors, invariants, events, and state transitions
- **Integration tests:** Repository (requires database), multi-tenant isolation, slug uniqueness, soft delete
- **E2E tests:** Full API flow, cross-tenant blocking

## Limitations (Phase 6.1)
- No inventory management
- No pricing
- No categories or brands
- No variants or SKU management
- No media/images
- No external integrations
- No public catalog endpoint
- Tenant resolution uses hardcoded `'default'` in controller (requires auth integration)
- No event publishing to message queue (events are logged only)
