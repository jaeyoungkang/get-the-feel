#!/usr/bin/env bash
# get-the-feel — 대표 후보를 GitHub Pages로 배포 (approve-5 재결정, 2026-06-11)
# 사용: tools/deploy/deploy-pages.sh <candidate-id>   예) c2-3
# 배포 저장소: github.com/jaeyoung2026/get-the-feel (공개 — 배포 산출물만, 방법론·기록 비공개 유지)
set -euo pipefail
CAND="${1:?candidate-id 필요 (예: c2-3)}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="$ROOT/candidates/$CAND"
[ -f "$SRC/index.html" ] || { echo "후보 없음: $SRC"; exit 1; }
node "$ROOT/tools/verdict/check.mjs" "$CAND" >/dev/null || { echo "verdict FAIL — 배포 차단"; exit 1; }
WORK="$(mktemp -d)"
git clone -q --depth 1 https://github.com/jaeyoung2026/get-the-feel.git "$WORK"
cp "$SRC"/index.html "$SRC"/styles.css "$SRC"/app.js "$SRC"/data.js "$WORK"/
cd "$WORK" && git add -A
git diff --cached --quiet && { echo "변경 없음"; exit 0; }
git commit -q -m "deploy: $CAND ($(date +%Y-%m-%d))" && git push -q
echo "배포됨: https://jaeyoung2026.github.io/get-the-feel/ ($CAND)"
