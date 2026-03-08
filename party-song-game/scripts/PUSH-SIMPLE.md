# דחיפה ל-GitHub – רק הדרך הזו

למה זה מבלבל?  
(1) ב-GitHub אי אפשר יותר להתחבר עם סיסמה – רק עם "טוקן".  
(2) המחשב שלך זוכר חשבון אחר (EfratAranOurRitual), אז גם כשאת רוצה EfratGarberAran הוא שולח את הישן.  
אנחנו עוקפים את שני הדברים עם הוראות אחת.

---

## מה עושים – 4 צעדים בלבד

### צעד 1: טוקן ב-GitHub (פעם אחת)

1. פתחי בדפדפן: **https://github.com/settings/tokens**
2. אם צריך – **היכנסי** עם החשבון **EfratGarberAran**.
3. לחצי **"Generate new token"** → **"Generate new token (classic)"**.
4. בשם כתבי: `push` (או כל שם).
5. תסמני **רק** את **repo** (וידאי שכל השאר לא מסומן).
6. גללי למטה ולחצי **"Generate token"**.
7. **העתיקי את הטוקן מיד** (מחרוזת שמתחילה ב־`ghp_...`) – לא תראי אותו שוב. שמרי אותו ב־Notes או בקובץ זמני.

---

### צעד 2: וידוא שאת בתיקייה הנכונה

פתחי **Terminal** והריצי:

```bash
cd /tmp/party-push
```

(אם כתוב שהתיקייה לא קיימת – תצטרכי קודם להריץ את בלוקים 1–4 מהקובץ RUN-THESE-COMMANDS.md, ואז לחזור לכאן.)

---

### צעד 3: דחיפה עם הטוקן (בלי שהטרמינל יבקש כלום)

המחשב שלך לא מציג חלון/שאלה של username ו-password, אז נותנים את הטוקן **בתוך הפקודה**.

**עשי כך:**

1. פתחי את הפקודה הזו (העתיקי אותה):
   ```bash
   cd /tmp/party-push && git push https://EfratGarberAran:YOUR_TOKEN@github.com/EfratGarberAran/party-song-game.git main
   ```
2. **לפני שאת לוחצת Enter** – **מחקי** את המילה `YOUR_TOKEN` והדביקי **במקום** את הטוקן שהעתקת מ-GitHub (המחרוזת שמתחילה ב־`ghp_`).  
   אסור שיהיו רווחים לפני או אחרי הטוקן.
3. לחצי Enter.

אם הדחיפה הצליחה – הריצי אחר כך את השורה הזו (כדי שה-remote לא ישמור את הטוקן):
```bash
git remote set-url origin https://github.com/EfratGarberAran/party-song-game.git
```

אחרי זה הקוד אמור להיות ב: **https://github.com/EfratGarberAran/party-song-game**

---

## אם כתוב "Invalid username or token"

זה אומר ש-GitHub קיבל **סיסמה רגילה** במקום **טוקן**.  
צריך להריץ שוב את הפקודה מהצעד 3, ובשדה **Password** להדביק **רק** את הטוקן מ־**https://github.com/settings/tokens** (המחרוזת שמתחילה ב־`ghp_`).

## אם כתוב "403" או "denied to EfratAranOurRitual"

המחשב עדיין שולח את החשבון הישן.  
פתחי **Keychain Access** (חיפוש ב-Spotlight), חפשי **github**, **מחקי** את כל הרשומות של github.com, סגרי, ונסי שוב מהצעד 3.
