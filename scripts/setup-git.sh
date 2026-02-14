#!/bin/bash
# Run from party-song-game folder:  bash scripts/setup-git.sh

set -e

if [ ! -f package.json ]; then
  echo "Run this from the party-song-game folder."
  exit 1
fi

if [ -d .git ]; then
  echo "Git repo already exists."
else
  git init
  echo "New git repo created."
fi

git add .
git status

if git diff --cached --quiet 2>/dev/null; then
  echo "No new changes to commit."
else
  git commit -m "Initial commit: Party Song Game"
  echo "First commit created."
fi

echo ""
echo "Next steps:"
echo "1. Go to https://github.com/new"
echo "2. Repository name: party-song-game"
echo "3. Do NOT check Add README. Click Create repository."
echo ""
echo "Then run (replace YOUR-USERNAME with your GitHub username):"
echo "  git remote add origin https://github.com/YOUR-USERNAME/party-song-game.git"
echo "  git branch -M main"
echo "  git push -u origin main"
echo ""
