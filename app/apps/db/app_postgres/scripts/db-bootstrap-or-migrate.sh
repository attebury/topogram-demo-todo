#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STATE_DIR="${TOPOGRAM_DB_STATE_DIR:-$(cd "$SCRIPT_DIR/../state" && pwd)}"
if [[ -f "$STATE_DIR/current.snapshot.json" ]]; then
  exec bash "$SCRIPT_DIR/db-migrate.sh"
fi
exec bash "$SCRIPT_DIR/db-bootstrap.sh"
