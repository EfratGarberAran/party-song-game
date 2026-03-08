#!/bin/bash
if grep -q $'\r' "$0" 2>/dev/null; then exec bash <(sed 's/\r$//' "$0") "$@"; fi
set -e
PROJECT_DIR=$(pwd)
REPO_URL="https://github.com/EfratGarberAran/party-song-game.git"
TEMP_DIR="/tmp/party-song-game-push"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"
git init
git remote add origin "$REPO_URL"
git checkout -b main
for f in "$PROJECT_DIR"/*; do
  test -e "$f" || continue
  name=$(basename "$f")
  test "$name" = "node_modules" && continue
  test "$name" = ".next" && continue
  test "$name" = ".git" && continue
  cp -r "$f" . 2>/dev/null || true
done
test -f "$PROJECT_DIR/.gitignore" && cp "$PROJECT_DIR/.gitignore" .
test -f "$PROJECT_DIR/.env.example" && cp "$PROJECT_DIR/.env.example" .
git add -A
git commit -m "Party Song Game - full project"
git push -u origin main
echo "Done: https://github.com/EfratGarberAran/party-song-game"
rm -rf "$TEMP_DIR"
