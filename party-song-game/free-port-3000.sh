#!/bin/sh
# Frees port 3000 so npm run dev uses it (required for Spotify)
for port in 3000 3001 3002; do
  pid=$(lsof -ti:$port 2>/dev/null)
  if [ -n "$pid" ]; then
    kill -9 $pid 2>/dev/null && echo "Port $port freed (PID $pid)"
  fi
done
echo "Now run: npm run dev"
