# דחיפת הקוד ל-GitHub – להריץ ידנית (בלי סקריפט)

---
## אם קיבלת 403 (Permission denied) ב־push

זה קורה כשהמחשב "זוכר" חשבון GitHub אחר. כך מתקנים:

**שלב 1 – יצירת סיסמה חדשה ל-Git (רק לחשבון EfratGarberAran)**  
1. היכנסי ל-GitHub **כשם המשתמש EfratGarberAran**.  
2. ללחוץ על התמונה למעלה מימין → **Settings**.  
3. בתפריט השמאלי למטה: **Developer settings** → **Personal access tokens** → **Tokens (classic)**.  
4. **Generate new token (classic)**.  
5. תני שם (למשל "מחשב בית"), סמני רק **repo**, ולחצי **Generate token**.  
6. **העתיקי את הטוקן** (מחרוזת ארוכה) – לא תוכלי לראות אותו שוב.

**שלב 2 – מחיקת ההתחברות הישנה של GitHub מהמחשב**  
פתחי Terminal והדביקי את זה (ואז Enter):
```
git credential-osxkeychain erase
host=github.com
protocol=https
```
(לחצי **Enter** שוב אחרי השורה האחרונה – יופיע שוב prompt.)

**שלב 3 – push מחדש**  
הריצי שוב (מתוך `/tmp/party-push`):
```
cd /tmp/party-push
git push -u origin main
```
כשיתבקש **Username** – כתבי: `EfratGarberAran`  
כשיתבקש **Password** – הדביקי את **הטוקן** שהעתקת (לא את סיסמת GitHub הרגילה).

אחרי זה ה-push אמור לעבור.

**אם במקום זה מופיע "Permission denied (publickey)"** – ה-remote עלה ב-SSH. מעבירים ל-HTTPS (כדי להשתמש בטוקן). הריצי:
```
git remote set-url origin https://github.com/EfratGarberAran/party-song-game.git
git push -u origin main
```
ואז כשמבקשים Username/Password – EfratGarberAran והטוקן.

**עדיין 403 ו"denied to EfratAranOurRitual"?** – המחשב עדיין משתמש בחשבון הישן. עושות **בדיוק** את זה:

1. **מחיקת פרטי GitHub מ־Keychain (חובה):**  
   פתחי **Keychain Access** ( Spotlight: "Keychain Access" ).  
   בשדה החיפוש למעלה כתבי: **github**  
   מחקי **כל** רשומה שקשורה ל־github.com (לחיצה ימנית → Delete). סגרי את Keychain.

2. **ב-Terminal** (מתוך `/tmp/party-push`):
```
cd /tmp/party-push
git remote set-url origin https://EfratGarberAran@github.com/EfratGarberAran/party-song-game.git
git push -u origin main
```
   כשמבקשים **רק Password** – הדביקי את הטוקן (ה-Username כבר מופיע בכתובת).

**עדיין 403 אחרי מחיקה מ-Keychain?** – מכריחים את Git **לא** להשתמש ב-Keychain (רק לפקודה הזו). הריצי:
```
cd /tmp/party-push
git remote set-url origin https://EfratGarberAran@github.com/EfratGarberAran/party-song-game.git
git -c credential.helper= push -u origin main
```
כשיתבקש **Username** – `EfratGarberAran`. כשיתבקש **Password** – הדביקי את הטוקן.

---

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
