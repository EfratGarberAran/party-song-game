#!/bin/bash
set -e
cd "$(dirname "$0")"

if ! command -v node &>/dev/null; then
  echo "Node.js לא מותקן או לא ב-PATH."
  echo "התקיני Node מ־https://nodejs.org או הפעילי nvm (nvm use)."
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "מתקין תלויות..."
  npm install
fi

echo "מעדכן Prisma..."
npx prisma generate
if [ ! -f "prisma/dev.db" ]; then
  echo "יוצר מסד נתונים..."
  npx prisma db push
fi
echo "מריץ שרת בפיתוח ב־http://localhost:3000"
npm run dev
