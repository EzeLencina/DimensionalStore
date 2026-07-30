#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$SCRIPT_DIR"

echo "WARNING: This will delete all volumes (PostgreSQL, Redis, uploads, logs)."
read -rp "Are you sure? [y/N] " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Aborted."
  exit 0
fi

echo "Stopping and removing containers..."
docker compose down -v

echo "Removing volumes..."
docker volume rm tienda-postgres tienda-redis tienda-uploads tienda-logs 2>/dev/null || true

echo "Done. Run ./docker/scripts/dev.sh to start fresh."
