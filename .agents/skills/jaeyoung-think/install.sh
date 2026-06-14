#!/usr/bin/env bash
#
# jaeyoung-think installer
# Symlinks this repo into Claude Code and Codex user-level skill directories.
#
# Usage (after git clone):
#   cd ~/jaeyoung-think
#   ./install.sh
#
# Re-run safely — existing symlinks are overwritten (-f).

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_NAME="jaeyoung-think"

CLAUDE_SKILLS="$HOME/.claude/skills"
CODEX_SKILLS="$HOME/.codex/skills"

install_for() {
  local target_root="$1"
  local label="$2"

  if [ ! -d "$(dirname "$target_root")" ]; then
    echo "[skip] $label: $(dirname "$target_root") does not exist"
    return 0
  fi

  mkdir -p "$target_root"
  ln -sfn "$REPO_DIR" "$target_root/$SKILL_NAME"
  echo "[ok]   $label: $target_root/$SKILL_NAME -> $REPO_DIR"
}

echo "Installing jaeyoung-think from $REPO_DIR"
echo

install_for "$CLAUDE_SKILLS" "Claude Code"
install_for "$CODEX_SKILLS"  "Codex"

echo
echo "Done. Try:"
echo "  Claude Code: /jaeyoung-think"
echo "  Codex:       \$jaeyoung-think"
echo
echo "To update:   cd $REPO_DIR && git pull"
echo "To uninstall: remove the symlinks above and delete $REPO_DIR"
