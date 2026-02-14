# דחיפת הקוד ל-GitHub – להריץ ידנית (בלי סקריפט)

פתחי Terminal, העתיקי והדביקי **כל בלוק** לפי הסדר. אחרי כל הדבקה לחצי Enter.

---

**בלוק 1 – ניקוי והכנה**
```
cd /Users/efrataram/party-song-game
rm -rf /tmp/party-push
mkdir -p /tmp/party-push
cd /tmp/party-push
```

---

**בלוק 2 – ריפו חדש ו-remote**
```
git init
git remote add origin https://github.com/EfratGarberAran/party-song-game.git
git checkout -b main
```

---

**בלוק 3 – העתקת קבצים (בלי node_modules ו-.next)**
```
cp -r /Users/efrataram/party-song-game/prisma /Users/efrataram/party-song-game/public /Users/efrataram/party-song-game/src .
cp /Users/efrataram/party-song-game/package.json /tmp/party-push/
cp /Users/efrataram/party-song-game/package-lock.json /tmp/party-push/ 2>/dev/null || true
cp /Users/efrataram/party-song-game/tsconfig.json /tmp/party-push/ 2>/dev/null || true
cp /Users/efrataram/party-song-game/next.config.* /tmp/party-push/ 2>/dev/null || true
cp /Users/efrataram/party-song-game/.gitignore /Users/efrataram/party-song-game/.env.example /tmp/party-push/
cp /Users/efrataram/party-song-game/DEPLOY.md /tmp/party-push/ 2>/dev/null || true
cp -r /Users/efrataram/party-song-game/scripts /tmp/party-push/ 2>/dev/null || true
```

(ה־`app` נמצא בתוך `src`, אז העתקת `src` מספיקה.)

---

**בלוק 4 – commit ו-push**
```
cd /tmp/party-push
git add -A
git status
git commit -m "Party Song Game"
git push -u origin main
```

---

**בלוק 5 – ניקוי**
```
rm -rf /tmp/party-push
```

אם הכל עבר – הקוד אמור להיות ב: https://github.com/EfratGarberAran/party-song-game
