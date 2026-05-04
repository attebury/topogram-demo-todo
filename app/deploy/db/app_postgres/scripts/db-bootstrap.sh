#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
. "$SCRIPT_DIR/db-common.sh"

provision_database_if_needed

if [[ -f "$CURRENT_SNAPSHOT" ]]; then
  echo "Current snapshot already exists at $CURRENT_SNAPSHOT. Run ./scripts/db-migrate.sh instead."
  refresh_runtime_clients
  exit 0
fi

existing_tables="$(user_table_count)"
if [[ "$existing_tables" != "0" ]]; then
  echo "Existing database is not empty and has no Topogram current snapshot." >&2
  echo "Refusing to apply generated bootstrap SQL to avoid destructive drift." >&2
  exit 1
fi

apply_init_sql
cp "$DESIRED_SNAPSHOT" "$CURRENT_SNAPSHOT"
refresh_runtime_clients
echo "Greenfield Postgres bootstrap complete."
