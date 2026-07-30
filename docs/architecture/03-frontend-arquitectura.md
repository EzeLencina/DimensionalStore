# ARQUITECTURA DEL FRONTEND

> Next.js 14+ (App Router) · TypeScript Strict · TailwindCSS · shadcn/ui · TanStack Query · Zustand · React Hook Form + Zod

---

## 1. Principios del Frontend

| Principio | Aplicación |
|-----------|-----------|
| **Server Components por defecto** | Todo es server component hasta que se necesita interactividad. Minimiza JS bundle. |
| **Composición sobre herencia** | Componentes pequeños y combinables. Slots, children, render props. |
| **Single Responsibility** | Cada componente hace una cosa. Un `ProductCard` no maneja estado global. |
| **Colocation** | Colocar componentes, hooks y tipos cerca de donde se usan. |
| **Data Fetching en Server** | TanStack Query solo para interactividad del dashboard. SSR/ISR para la tienda pública. |
| **Estado global mínimo** | Zustand solo para auth, carrito y UI. Todo lo demás via props o TanStack Query cache. |
| **Accesibilidad** | WCAG 2.1 AA. Labels, roles, keyboard navigation, focus management. |
| **SEO nativo** | Server Components, metadata API, sitemap generado, Open Graph. |

---

## 2. Route Groups (App Router)

```
┌────────────────────────────────────────────────────────────────────┐
│                            app/                                     │
│                                                                     │
│  ┌───────────────────────┐  ┌─────────────────┐  ┌──────────────┐  │
│  │      (shop)            │  │  (dashboard)     │  │   (auth)     │  │
│  │  ─────────────         │  │  ──────────      │  │  ───────     │  │
│  │  Tienda pública        │  │  Panel admin      │  │  Login/Reg  │  │
│  │                       │  │                  │  │              │  │
│  │  Layouts:             │  │  Layouts:         │  │  Layout:     │  │
│  │  • Header público     │  │  • Sidebar        │  │  • Minimal   │  │
│  │  • Footer             │  │  • Topbar         │  │  • Centered  │  │
│  │  • Breadcrumbs        │  │  • Breadcrumbs    │  │              │  │
│  │                       │  │  • Command K      │  │              │  │
│  └───────────────────────┘  └─────────────────┘  └──────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                      api/                                     │   │
│  │  Route Handlers (BFF): /api/auth/*, /api/webhooks/*           │   │
│  └──────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

---

## 3. Arquitectura de Componentes (Jerarquía)

```
┌────────────────────────────────────────────────────────┐
│                     LAYOUTS                              │
│  shop-layout.tsx, dashboard-layout.tsx, auth-layout.tsx  │
│  (Providers, Sidebars, Headers, Footers)                 │
├────────────────────────────────────────────────────────┤
│                     PAGES (Server)                       │
│  app/(shop)/productos/[slug]/page.tsx                    │
│  app/(dashboard)/productos/page.tsx                      │
│  (Fetch data, compose sections, SEO metadata)            │
├────────────────────────────────────────────────────────┤
│                     WIDGETS / SECTIONS                   │
│  ProductGallery, ProductInfo, RelatedProducts,           │
│  SalesChart, RecentOrders, StockAlerts                   │
│  (Combinan organismos, pueden ser client/server)         │
├────────────────────────────────────────────────────────┤
│                     ORGANISMS                             │
│  ProductCard, OrderTable, CustomerForm,                  │
│  CartDrawer, CheckoutForm, DataGrid                      │
│  (Combinan moléculas, lógica de negocio)                 │
├────────────────────────────────────────────────────────┤
│                     MOLECULES                             │
│  SearchInput, SKUInput, PriceInput,                      │
│  Pagination, FilterBar, SortDropdown                     │
│  (Combinan átomos, funcionalidad específica)             │
├────────────────────────────────────────────────────────┤
│                     ATOMS (shadcn/ui)                     │
│  Button, Input, Select, Dialog, Table, Card, Badge       │
│  (Componentes base, puramente UI)                        │
└────────────────────────────────────────────────────────┘
```

---

## 4. Providers (Árbol de Contexto)

```
<App>                                    # RootLayout
  <QueryProvider>                        # TanStack Query
    <ThemeProvider>                      # next-themes (dark/light)
      <AuthProvider>                     # Sesión + JWT
        <TenantProvider>                 # Tenant actual
          <UIProvider>                   # Sidebar, modales, toasts
            {children}
          </UIProvider>
        </TenantProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryProvider>
</App>
```

### Provider Details

| Provider | Propósito | Estado |
|----------|-----------|--------|
| **QueryProvider** | TanStack QueryClient con defaults (staleTime, retry, refetch) | Cache global |
| **AuthProvider** | Sesión del usuario, tokens, refresh automático | Zustand `auth-store` |
| **TenantProvider** | Tenant actual, settings, moneda, idioma | Zustand `tenant-store` |
| **ThemeProvider** | next-themes para dark/light mode | Cookie + class |
| **UIProvider** | Sidebar open/close, toasts, command palette | Zustand `ui-store` |

---

## 5. Manejo de Estado

### Estrategia

| Estado | Herramienta | Scope |
|--------|-----------|-------|
| **Server data** (productos, órdenes, clientes) | TanStack Query (caché) | Global (cacheada) |
| **Auth session** | Zustand + Cookies | Global |
| **Carrito de compras** | Zustand + persistencia localStorage | Global |
| **UI state** (sidebar, modales) | Zustand | Global |
| **Form state** | React Hook Form + Zod | Local al formulario |
| **URL state** (filters, page, sort) | useSearchParams + nuqs | URL |

### TanStack Query Configuration

```typescript
// providers/query-provider.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,     // 2 min antes de refetch
      gcTime: 1000 * 60 * 10,        // 10 min en caché
      retry: 2,
      refetchOnWindowFocus: false,   // Evita refetch innecesario
    },
    mutations: {
      retry: 0,
    },
  },
});
```

### Stores (Zustand)

```typescript
// stores/auth-store.ts
interface AuthState {
  user: User | null;
  token: string | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  login: (credentials: LoginDTO) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

// stores/cart-store.ts
interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  total: number;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  clearCart: () => void;
}

// stores/ui-store.ts
interface UIState {
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  toasts: Toast[];
  toggleSidebar: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
}
```

---

## 6. Data Fetching Strategy

### Tienda Pública (Server Components — SSR/ISR)

```typescript
// app/(shop)/productos/[slug]/page.tsx
interface Props {
  params: { slug: string };
}

async function ProductPage({ params }: Props) {
  // Fetch en servidor — SEO visible, sin loading state
  const product = await api.getProductBySlug(params.slug);

  // Metadata dinámica
  const metadata = generateProductMetadata(product);

  return (
    <>
      <Script id="product-structured-data" type="application/ld+json">
        {generateProductLDJSON(product)}
      </Script>
      <ProductGallery images={product.images} />
      <ProductInfo product={product} />
      <RelatedProducts categoryId={product.categoryId} />
    </>
  );
}
```

### Dashboard (Client Components — CSR con TanStack Query)

```typescript
// app/(dashboard)/productos/page.tsx
'use client';

function ProductListPage() {
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);
  const { data, isLoading, error } = useProductList(filters);
  const pagination = usePagination(data?.pagination);

  if (isLoading) return <ProductListSkeleton />;
  if (error) return <ErrorState error={error} onRetry={() => refetch()} />;
  if (!data?.items.length) return <EmptyState type="products" />;

  return (
    <div>
      <ProductFiltersBar value={filters} onChange={setFilters} />
      <DataTable
        columns={productColumns}
        data={data.items}
        pagination={pagination}
        onRowClick={(product) => router.push(`/productos/${product.id}`)}
      />
    </div>
  );
}
```

---

## 7. Hooks Personalizados

```typescript
// hooks/
├── use-auth.ts              # login, logout, register, resetPassword
├── use-tenant.ts            # tenant info, settings
├── use-pagination.ts        # paginación con offset/limit
├── use-filters.ts           # filtros sincronizados con URL
├── use-debounce.ts          # debounce para búsqueda
├── use-media-query.ts       # responsive breakpoints
├── use-permissions.ts       # verificar permisos del usuario
├── use-notification.ts      # toast notifications
├── use-products.ts          # TanStack Query hooks para productos
│   ├── use-product-list.ts
│   ├── use-product.ts
│   ├── use-create-product.ts
│   ├── use-update-product.ts
│   └── use-delete-product.ts
├── use-orders.ts            # TanStack Query hooks para órdenes
├── use-customers.ts         # TanStack Query hooks para clientes
├── use-inventory.ts         # TanStack Query hooks para inventario
└── use-finances.ts          # TanStack Query hooks para finanzas
```

### Ejemplo de Custom Hook

```typescript
// hooks/use-products.ts
export function useProductList(filters: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsService.list(filters),
    placeholderData: keepPreviousData,
  });
}

export function useProduct(sku: string) {
  return useQuery({
    queryKey: ['products', sku],
    queryFn: () => productsService.getBySku(sku),
    enabled: !!sku,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDTO) => productsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
```

---

## 8. Formularios (React Hook Form + Zod)

```typescript
// components/forms/product-form/product-form.tsx
'use client';

const productSchema = z.object({
  sku: z.string().min(1, 'SKU requerido').max(20),
  name: z.string().min(3).max(200),
  description: z.string().max(5000).optional(),
  price: z.number().positive('Precio debe ser mayor a 0'),
  categoryId: z.string().uuid(),
  brandId: z.string().uuid().optional(),
  weight: z.number().positive().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DRAFT']),
  variants: z.array(z.object({
    sku: z.string().min(1),
    name: z.string(),
    priceOverride: z.number().positive().optional(),
    stock: z.number().int().min(0),
  })).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductForm({ product, onSubmit }: ProductFormProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ?? defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <SKUInput control={form.control} name="sku" />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <PriceInput control={form.control} name="price" />
        <CategorySelect control={form.control} name="categoryId" />
        {/* ... */}
        <Button type="submit">Guardar Producto</Button>
      </form>
    </Form>
  );
}
```

---

## 9. Tablas y Data Grid

```typescript
// components/ui/data-table.tsx
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  onRowClick?: (row: TData) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

// components/shared/tables/product-columns.tsx
export const productColumns: ColumnDef<Product>[] = [
  { accessorKey: 'sku', header: 'SKU' },
  { accessorKey: 'name', header: 'Nombre' },
  {
    accessorKey: 'price',
    header: 'Precio',
    cell: ({ row }) => formatCurrency(row.getValue('price')),
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
    cell: ({ row }) => <StockBadge level={row.getValue('stock')} />,
  },
  {
    id: 'actions',
    cell: ({ row }) => <TableActions product={row.original} />,
  },
];
```

---

## 10. Servicios (API Client)

```typescript
// services/api-client.ts
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: attach JWT token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const tenant = useTenantStore.getState().tenant;
  if (tenant) config.headers['X-Tenant-Slug'] = tenant.slug;

  return config;
});

// Interceptor: refresh token on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await useAuthStore.getState().refreshToken();
    }
    return Promise.reject(error);
  },
);

// services/products.service.ts
export const productsService = {
  list: (filters: ProductFilters) =>
    apiClient.get<ProductListResponse>('/products', { params: filters }),
  getBySku: (sku: string) =>
    apiClient.get<ProductResponse>(`/products/${sku}`),
  create: (data: CreateProductDTO) =>
    apiClient.post<ProductResponse>('/products', data),
  update: (sku: string, data: UpdateProductDTO) =>
    apiClient.put<ProductResponse>(`/products/${sku}`, data),
  delete: (sku: string) =>
    apiClient.delete(`/products/${sku}`),
};
```

---

## 11. Layouts

### Shop Layout (Público)

```typescript
// app/(shop)/layout.tsx
export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header
        logo={<StoreLogo />}
        navigation={<MainNavigation />}
        actions={<ShopActions />}  // Carrito, búsqueda, login
      />
      <main className="min-h-screen">{children}</main>
      <Footer
        links={<FooterLinks />}
        newsletter={<NewsletterForm />}
        social={<SocialLinks />}
      />
    </>
  );
}
```

### Dashboard Layout (Admin)

```typescript
// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarLogo />
        <SidebarNavigation />     // Nav items según permisos
        <SidebarFooter />         // User info, logout
      </Sidebar>
      <div className="flex-1 flex flex-col">
        <Topbar>
          <Breadcrumbs />
          <SearchCommand />       // Cmd+K global
          <UserMenu />
          <NotificationsBell />
        </Topbar>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
```

---

## 12. Estrategia de Renderizado

| Página | Estrategia | Razón |
|--------|-----------|-------|
| **Home** | SSR + ISR (revalidate: 300) | SEO crítico, contenido dinámico |
| **Producto** | SSR + ISR (on-demand via webhook) | SEO crítico, precio/stock actualizado |
| **Categoría** | SSR + ISR (revalidate: 600) | SEO, listados |
| **Carrito** | CSR | Estado efímero del usuario |
| **Checkout** | CSR | Formularios, pasarela de pago |
| **Dashboard** | CSR | Datos en tiempo real, filtros |
| **Reportes** | CSR con datos precargados (SSR) | Datos pesados, evitar blank state |
| **Login/Register** | CSR | No necesita SEO |

---

## 13. SEO y Meta Tags

```typescript
// app/(shop)/productos/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await api.getProductBySlug(params.slug);
  return {
    title: `${product.name} | Tienda`,
    description: product.description?.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images[0]?.url }],
    },
    alternates: {
      canonical: `/productos/${product.slug}`,
    },
  };
}
```

---

## 14. Componentes Compartidos

| Componente | Propósito | Estado |
|-----------|-----------|--------|
| `SKUInput` | Input con validación y formateo de SKU | Atómico |
| `PriceInput` | Input monetario con formateo | Atómico |
| `SearchInput` | Búsqueda con debounce y autocomplete | Molécula |
| `Pagination` | Paginación completa con info de resultados | Molécula |
| `FilterBar` | Barra de filtros activos + botón de filtros | Organismo |
| `EmptyState` | Estado vacío con icono, mensaje y CTA | Organismo |
| `ErrorState` | Estado de error con retry | Organismo |
| `LoadingState` | Skeleton loaders | Organismo |
| `ConfirmDialog` | Confirmación destructiva | Molécula |
| `DataTable` | Tabla genérica con paginación, sort, selección | Organismo |
| `KPICard` | Tarjeta de métrica con icono, valor, tendencia | Molécula |
| `StatusBadge` | Badge con color según estado | Atómico |
