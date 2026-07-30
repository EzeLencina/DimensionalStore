# DevOps Infrastructure

## Directory Structure

```
.github/
  actions/
    setup/action.yml        # pnpm + Node.js setup with caching
    cache/action.yml        # Cache save/restore (pnpm store, turbo)
    quality/action.yml      # Lint, typecheck, format, arch checks
    test/action.yml         # Test runner with coverage + artifacts
    install/action.yml      # pnpm install
    build/action.yml        # Monorepo build with artifact upload
  workflows/
    ci.yml                  # Main CI (quality -> test/build/security)
    pr-check.yml            # PR validation (quality + semantic title)
    security-scan.yml       # Weekly + on-push security audits
    docker-validate.yml     # Docker build + compose validation
    release-validation.yml  # Full suite on version tags
scripts/
  check-circular-deps.mjs   # madge circular dependency detection
  check-unused-exports.mjs  # ts-unused-exports analysis
  check-unused-deps.mjs     # depcheck for missing/unused deps
  check-arch-rules.mjs      # Core module import rule enforcement
  setup.sh                  # Local dev setup (git clone + pnpm + build)
```

## Pipeline Flow

```
Push/PR ──> CI ──> Quality Gates ──> Tests ──> Build ──> Security
                │                      │           │          │
                │                      │           │          └─ audit
                │                      │           │          └─ secret scan
                │                      │           │          └─ dep review
                │                      │           │
                │                      │           └── artifacts
                │                      │
                │                      └── coverage report
                │
                └── PR Check
                    ├── PR Title (semantic)
                    └── Label Check

Tag push ──> Release Validation ──> Full quality + tests + Docker images
```

## Quality Gates

| Gate               | Tool            | Threshold                    |
|-------------------|-----------------|------------------------------|
| ESLint            | turbo lint      | 0 errors, 0 warnings         |
| TypeScript        | turbo typecheck | strict, 0 errors             |
| Prettier          | format:check    | 0 formatting issues          |
| Unit Coverage     | jest/vitest     | >= 90% lines, branches, fns  |
| Circular Deps     | madge           | 0 circular dependencies      |
| Architecture      | custom script   | core modules scoped          |

## Caching Strategy

| Cache          | Key                                              | Scope     |
|----------------|--------------------------------------------------|-----------|
| pnpm store     | `hashFiles('pnpm-lock.yaml')`                    | Global    |
| Turbo          | `github.sha` with restore from `main`            | Per-branch|
| node_modules   | Restored via pnpm cache                          | Global    |

## Reusable Actions

- **setup**: Checkout -> pnpm -> Node.js -> cache restore -> install -> Prisma
- **cache**: Save pnpm store + turbo caches
- **quality**: ESLint -> tsc -> prettier -> circular deps -> arch rules
- **test**: Unit/Integration/E2E with coverage upload
- **install**: pnpm install --frozen-lockfile
- **build**: pnpm build with artifact upload

## Security

- **pnpm audit** --audit-level=high on every CI run
- **Dependency Review** action on PRs (fails on high severity)
- **Secret scanning** via TruffleHog (verified secrets only)
- **License validation** weekly (MIT, Apache-2.0, ISC, BSD, 0BSD, CC0-1.0, Unlicense)
- **Scheduled weekly scan** every Monday at 06:00 UTC

## Docker

- **Multi-stage builds** for backend and frontend
- **Dockerfile lint** via Hadolint (warning threshold)
- **Build validation** on every PR touching docker/ files
- **Compose file validation** (dev + prod) via `docker compose config`

## Risk Assessment

| Risk                         | Mitigation                                      |
|------------------------------|-------------------------------------------------|
| Cache miss                   | Multiple restore keys fallback to main          |
| Flaky tests                  | Separate unit/integration/e2e stages            |
| Long CI times                | Concurrency groups + Turbo remote caching       |
| Secret leak                  | TruffleHog + .dockerignore + .gitignore         |
| Dependency vulnerability     | Weekly audit + PR dependency review             |
| Architecture erosion         | Custom arch rules script in quality gates       |

## Local Development

```bash
# Full setup
pnpm install && pnpm build

# Quality checks
pnpm lint && pnpm typecheck && pnpm format:check

# Run tests
pnpm test
```
