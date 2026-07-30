#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$SCRIPT_DIR"

SERVICE="${1:-}"

echo "Rebuilding images..."
if [ -n "$SERVICE" ]; then
  docker compose build --no-cache "$SERVICE"
else
  docker compose build --no-cache
fi

echo "Done. Run ./docker/scripts/dev.sh to start."
