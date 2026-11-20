#!/usr/bin/env bash
set -e

project_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
services=(auth-service booking-service catalog-service gateway)
pids=()

if ! command -v bun >/dev/null 2>&1; then
  printf 'Bun is required to run the TypeScript services.\n' >&2
  exit 1
fi

cleanup() {
  local pid
  for pid in "${pids[@]}"; do
    kill -TERM "$pid" 2>/dev/null || true
  done
  wait
}

trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

for service in "${services[@]}"; do
  printf 'Starting %s\n' "$service"
  (
    cd -- "$project_dir/backend/$service"
    exec bun src/index.ts
  ) &
  pids+=("$!")
done

# Poll child status so this also works with macOS Bash, which lacks wait -n.
while true; do
  for i in "${!pids[@]}"; do
    pid="${pids[i]}"
    if ! kill -0 "$pid" 2>/dev/null; then
      status=0
      wait "$pid" || status=$?
      unset 'pids[i]'
      printf '%s exited (status %s). Stopping the other services.\n' "${services[i]}" "$status" >&2
      if (( status == 0 )); then
        exit 1
      fi
      exit "$status"
    fi
  done
  sleep 1
done
