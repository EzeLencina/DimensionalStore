#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$SCRIPT_DIR"

echo "Starting Tienda development environment..."

if [ ! -f .env.docker ]; then
  echo "Creating .env.docker from template..."
  cp .env.docker.example .env.docker
fi

docker compose up --build -d

echo "Services:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:4000"
echo "  API:      http://localhost:4000/api/v1"
echo "  Postgres: localhost:5432"
echo "  Redis:    localhost:6379"
echo ""
echo "Run ./docker/scripts/logs.sh to follow logs."
