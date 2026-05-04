#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DB_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
STATE_DIR="$DB_DIR/state"
CURRENT_SNAPSHOT="$STATE_DIR/current.snapshot.json"
DESIRED_SNAPSHOT="$STATE_DIR/desired.snapshot.json"
MIGRATION_SQL="$DB_DIR/migrations/0001_init.sql"
mkdir -p "$STATE_DIR"

require_env() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "$name is required." >&2
    exit 1
  fi
}

ensure_psql() {
  if ! command -v psql >/dev/null 2>&1; then
    echo "psql is required to bootstrap this Postgres lifecycle bundle." >&2
    exit 1
  fi
}

psql_url() {
  printf '%s' "$DATABASE_URL"
}

admin_psql_url() {
  printf '%s' "${DATABASE_ADMIN_URL:-}"
}

database_name() {
  node --input-type=module -e 'const url = new URL(process.argv[1]); console.log(url.pathname.replace(/^\//, ""));' "$DATABASE_URL"
}

provision_database_if_needed() {
  require_env DATABASE_URL
  ensure_psql
  if psql "$(psql_url)" -v ON_ERROR_STOP=1 -c 'select 1' >/dev/null 2>&1; then
    return
  fi
  require_env DATABASE_ADMIN_URL
  local db_name
  db_name="$(database_name)"
  if [[ -z "$db_name" ]]; then
    echo "Could not infer target database name from DATABASE_URL." >&2
    exit 1
  fi
  if ! psql "$(admin_psql_url)" -Atqc "select 1 from pg_database where datname = '$db_name'" | grep -q 1; then
    psql "$(admin_psql_url)" -v ON_ERROR_STOP=1 -c "create database "$db_name""
  fi
}

user_table_count() {
  psql "$(psql_url)" -Atqc "select count(*) from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE'"
}

apply_init_sql() {
  ensure_psql
  psql "$(psql_url)" -v ON_ERROR_STOP=1 -f "$MIGRATION_SQL"
}

refresh_runtime_clients() {
  local runtime_server_dir="${TOPOGRAM_RUNTIME_SERVER_DIR:-}"
  if [[ -n "$runtime_server_dir" && -f "$runtime_server_dir/package.json" ]]; then
    (cd "$runtime_server_dir" && npm install && npm exec -- prisma generate --schema prisma/schema.prisma)
  fi
}
