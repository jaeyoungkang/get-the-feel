#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${REPO_DIR:-/root/.openclaw/workspace/repos/get-the-feel}"
BRANCH="${BRANCH:-main}"
SERVICE="${SERVICE:-get-the-feel}"
HEALTH_PATH="${HEALTH_PATH:-/}"

if [ -f /etc/get-the-feel.env ]; then
  set -a
  # shellcheck disable=SC1091
  . /etc/get-the-feel.env
  set +a
fi

PORT="${PORT:-8785}"
BASE_PATH="${BASE_PATH:-}"

if [ -z "${DEPLOY_SCRIPT_REEXEC:-}" ]; then
  cd "$REPO_DIR"
  echo "[deploy] fetching latest from origin/$BRANCH (pre-exec)"
  git fetch origin "$BRANCH"
  git checkout "$BRANCH"
  git reset --hard "origin/$BRANCH"
  export DEPLOY_SCRIPT_REEXEC=1
  exec bash "$REPO_DIR/deploy/deploy.sh"
fi

cd "$REPO_DIR"

if ! command -v node >/dev/null 2>&1; then
  echo "[deploy] node is required on the remote PC"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[deploy] npm is required on the remote PC"
  exit 1
fi

echo "[deploy] installing dependencies"
npm ci

echo "[deploy] syncing generated legacy data"
npm run content:sync-legacy

echo "[deploy] running quality gate"
npm run quality:check

echo "[deploy] building deploy artifact"
if [ -n "$BASE_PATH" ]; then
  NEXT_PUBLIC_BASE_PATH="$BASE_PATH" npm run build
else
  npm run build
fi

if command -v systemctl >/dev/null 2>&1 && [ -d /etc/systemd/system ]; then
  install -m 0644 "$REPO_DIR/deploy/$SERVICE.service" "/etc/systemd/system/$SERVICE.service"
  install -m 0644 "$REPO_DIR/deploy/cloudflared-$SERVICE.service" "/etc/systemd/system/cloudflared-$SERVICE.service"

  systemctl daemon-reload || true
  systemctl enable "$SERVICE.service"
  systemctl enable "cloudflared-$SERVICE.service" || true
  systemctl restart "$SERVICE.service"
  systemctl restart "cloudflared-$SERVICE.service" || true

  python3 - "$PORT" "$HEALTH_PATH" <<'PY'
import sys, time, urllib.request

port, path = sys.argv[1], sys.argv[2]
url = f"http://127.0.0.1:{port}{path}"
last = None
for _ in range(30):
    try:
        with urllib.request.urlopen(url, timeout=2) as response:
            if response.status < 400:
                print(f"[deploy] smoke OK: {url}")
                break
            last = f"HTTP {response.status}"
    except Exception as exc:
        last = str(exc)
    time.sleep(0.5)
else:
    raise SystemExit(f"smoke check failed: {url}: {last}")
PY
  echo "[deploy] restarted systemd services"
else
  echo "[deploy] systemctl unavailable, manual restart required"
fi

echo "[deploy] done"
