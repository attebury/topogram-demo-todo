#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
. "$SCRIPT_DIR/db-common.sh"

provision_database_if_needed
if [[ ! -f "$CURRENT_SNAPSHOT" ]]; then
  exec bash "$SCRIPT_DIR/db-bootstrap.sh"
fi

refresh_runtime_clients
echo "Generated Postgres lifecycle snapshot is current; no SQL migration was applied."
