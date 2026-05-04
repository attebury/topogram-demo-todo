#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
. "$SCRIPT_DIR/db-common.sh"
echo "Postgres lifecycle files:"
for file in schema.sql migrations/0001_init.sql prisma/schema.prisma lifecycle.plan.json state/desired.snapshot.json; do
  if [[ -f "$DB_DIR/$file" ]]; then
    echo "- $file"
  else
    echo "- missing: $file"
  fi
done
