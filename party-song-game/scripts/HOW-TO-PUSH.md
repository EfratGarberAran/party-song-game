# איך לדחוף שינויים ל-GitHub

## מהפרויקט הנוכחי (party-song-game)

פתחי **Terminal** והריצי:

### 1. מעבר לתיקיית הפרויקט

```bash
cd /Users/efrataram/party-song-game
```

(אם ה־git נמצא דווקא אצל efrataram, הריצי: `cd /Users/efrataram`)

### 2. בדיקה מה השתנה

```bash
git status
```

תראי רשימת קבצים ששונו (modified) וקבצים חדשים (untracked).

### 3. להוסיף את השינויים

**רק קבצי party-song-game (בלי קבצי מערכת):**

```bash
git add party-song-game/src party-song-game/scripts/COPY-PROPOSAL.md party-song-game/README.md party-song-game/SPOTIFY_SETUP.md
```

אם את **בתוך** תיקיית party-song-game (ו־.git נמצא שם), אז:

```bash
git add src scripts/COPY-PROPOSAL.md README.md SPOTIFY_SETUP.md
```

### 4. קומיט

```bash
git commit -m "Party Shuffle: שם ותת-כותרת חדשים, הצעת קופי"
```

### 5. דחיפה (push)

```bash
git push origin main
```

---

## אם מקבלת 403 או "Permission denied"

המחשב עלול לשלוח חשבון GitHub אחר. לפי **PUSH-SIMPLE.md**:

1. **טוקן:** ב־https://github.com/settings/tokens צרי טוקן (classic), עם הרשאת **repo** בלבד. העתיקי את הטוקן (מתחיל ב־`ghp_`).

2. **דחיפה עם הטוקן** (החליפי את `YOUR_TOKEN` בטוקן האמיתי):

   ```bash
   git push https://EfratGarberAran:YOUR_TOKEN@github.com/EfratGarberAran/party-song-game.git main
   ```

3. **אחרי שהדחיפה עבדה** – החזירי את ה־remote ל־URL רגיל (בלי טוקן):

   ```bash
   git remote set-url origin https://github.com/EfratGarberAran/party-song-game.git
   ```

---

## אם ה-repo נמצא ב־/tmp/party-push

אם את עובדת לפי **RUN-THESE-COMMANDS.md** עם העתקה ל־`/tmp/party-push`:

1. העתיקי את השינויים שלך לתוך `/tmp/party-push`
2. ואז:
   ```bash
   cd /tmp/party-push
   git add .
   git commit -m "Party Shuffle: שם ותת-כותרת חדשים"
   git push -u origin main
   ```
   (בהתבקש Username: EfratGarberAran, Password: הטוקן מ-GitHub)
