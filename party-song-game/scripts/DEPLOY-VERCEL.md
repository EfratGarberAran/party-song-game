# פריסה חינמית: Vercel + Neon (בלי Railway)

ב-Railway נגמר ה-Trial ולכן השירותים כבויים. כאן משתמשים ב-**Vercel** (אפליקציה) ו-**Neon** (מסד נתונים) – שניהם בחינם, בלי כרטיס אשראי.

---

## סדר העבודה (בקצרה)

1. **Neon** – יצירת מסד נתונים חינמי, העתקת `DATABASE_URL`
2. **Vercel** – חיבור הריפו מ-GitHub, הוספת משתני סביבה, פריסה
3. **טרמינל** – הרצת `prisma db push` עם ה-DATABASE_URL מ-Neon (יצירת הטבלאות)
4. **Vercel** – הוספת `NEXT_PUBLIC_APP_URL` עם הכתובת שקיבלת
5. **Spotify** – הוספת Redirect URI לכתובת החיה

---

# חלק א׳: מסד נתונים ב-Neon (חינם)

## צעד 1.1 – חשבון ויצירת פרויקט

1. גלשי ל-[neon.tech](https://neon.tech) ולחצי **Sign up** (התחברי עם GitHub אם תרצי).
2. אחרי הכניסה – **New Project**. תני שם (למשל `party-song-game`) ובחרי אזור (כל אחד בסדר).
3. לחצי **Create project**.

## צעד 1.2 – העתקת DATABASE_URL

**מה זה בכלל:**  
ה־**Connection string** (או "מחרוזת חיבור") היא שורת טקסט ארוכה שמתחילה ב־`postgresql://` ומכילה את כל המידע כדי להתחבר למסד הנתונים שיצרת ב-Neon. את השורה הזו נשתמש כ־**DATABASE_URL**.

**איפה מוצאים אותה:**

1. **אחרי** שלחצת **Create project** ב-Neon – נפתח דף הפרויקט.
2. בדף יש אזור שנקרא **Connection details** או **Connect** (לפעמים עם טאבים כמו **Dashboard** / **Connection string**).
3. תראי שם **שדה טקסט** עם שורה ארוכה שמתחילה ב־`postgresql://` ומכילה גם סימנים כמו `@`, `:`, `.neon.tech` וכו'.  
   דוגמה (לא להעתיק – רק כדי להבין איך זה נראה):  
   `postgresql://user:xxxxx@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`
4. ליד השדה יש בדרך כלל **כפתור Copy** (אייקון של שני מלבנים) – **לחצי עליו** כדי שהמחרוזת כולה תועתק ללוח.
5. אם אין כפתור – **סמני** את כל התוכן של השדה עם העכבר (לחיצה כפולה או Ctrl+A) ואז **העתיקי** (Ctrl+C או Cmd+C).

**אם יש שני סוגים:** בחרי **Pooled connection** (ולא "Direct") – מתאים ל-Vercel.

המחרוזת שהעתקת = **DATABASE_URL**. שמרי אותה ב-Notes או בקובץ – תצטרכי להדביק אותה ב-Vercel ובטרמינל.

---

# חלק ב׳: פריסת האפליקציה ב-Vercel

## צעד 2.1 – ייבוא הפרויקט מ-GitHub

1. גלשי ל-[vercel.com](https://vercel.com) והתחברי עם **GitHub**.
2. לחצי **Add New…** → **Project**.
3. תחת **Import Git Repository** – חפשי **party-song-game** (או **EfratGarberAran/party-song-game**).
4. אם הריפו לא מופיע – **Adjust GitHub App Permissions** והוסיפי גישה לארגון/לריפו.
5. לחצי **Import** ליד הריפו.

## צעד 2.2 – משתני סביבה (לפני ה-Deploy)

1. לפני שלוחצים **Deploy**, גללי ל-**Environment Variables**.
2. הוסיפי את המשתנים הבאים (שם וערך):

| Name | Value |
|------|--------|
| `DATABASE_URL` | המחרוזת שהעתקת מ-Neon (מתחילה ב־`postgresql://`) |
| `NEXTAUTH_SECRET` | מחרוזת אקראית ארוכה – אפשר ליצור ב-[generate-secret.vercel.app/32](https://generate-secret.vercel.app/32) |
| `SPOTIFY_CLIENT_ID` | מה-Spotify Dashboard – Client ID |
| `SPOTIFY_CLIENT_SECRET` | מה-Spotify Dashboard – Client Secret |

**עדיין לא** מוסיפים `NEXT_PUBLIC_APP_URL` – נוסיף אחרי שיהיה כתובת (חלק ד׳).

3. לחצי **Deploy**. Vercel יבנה את הפרויקט וייתן כתובת, למשל:  
   `party-song-game-xxxx.vercel.app`

---

# חלק ג׳: יצירת הטבלאות במסד (פעם אחת)

במחשב שלך, **בתיקיית הפרויקט**:

1. פתחי טרמינל והריצי:
   ```bash
   cd /Users/efrataram/party-song-game
   ```
2. הדביקי את ה-**DATABASE_URL** מ-Neon במקום `הערך-מ-Neon` (כולל המרכאות):
   ```bash
   DATABASE_URL="הערך-מ-Neon" npx prisma db push
   ```
   דוגמה (עם ערך דמה):
   ```bash
   DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require" npx prisma db push
   ```
3. אם מופיע "Your database is now in sync" או הודעות על עדכון – הצליח.

---

# חלק ד׳: כתובת האתר ו-NEXT_PUBLIC_APP_URL

## צעד 4.1 – העתקת הכתובת מ-Vercel

1. ב-Vercel, בפרויקט **party-song-game**, נכנסים ל-**Settings** → **Domains** (או רואים את הדומיין בדף הפרויקט).
2. הכתובת תיראה בערך כך: `party-song-game-xxxx.vercel.app`.
3. העתיקי עם **https://** ובלי סלאש בסוף, למשל:  
   `https://party-song-game-xxxx.vercel.app`

## צעד 4.2 – הוספת המשתנה ב-Vercel

1. ב-Vercel: **Settings** → **Environment Variables**.
2. **Add New**:
   - **Name:** `NEXT_PUBLIC_APP_URL`
   - **Value:** הכתובת שהעתקת (עם `https://`, בלי סלאש).
3. שמרי. מומלץ להריץ **Redeploy** מהטאב **Deployments** (לחצי על שלוש הנקודות ליד ה-deploy האחרון → Redeploy) כדי שהמשתנה ייטען.

---

# חלק ה׳: עדכון ספוטיפיי (Redirect URI)

1. היכנסי ל-[developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) ובחרי את האפליקציה של משחק השירים.
2. **Settings** → גללי ל-**Redirect URIs**.
3. הוסיפי בדיוק (עם הכתובת האמיתית מ-Vercel):
   ```
   https://party-song-game-xxxx.vercel.app/api/spotify/callback
   ```
   (החליפי את `party-song-game-xxxx.vercel.app` בכתובת שקיבלת.)
4. **Save**.

מעכשיו התחברות ספוטיפיי תעבוד גם מהאתר החי.

---

# סיום

- **כתובת האתר:** תופיע ב-Vercel תחת הפרויקט (לחיצה על הדומיין או **Visit**).
- משתתפים נכנסים לכתובת הזו מהטלפון או מהמחשב.

---

## אם משהו לא עובד

- **שגיאת build ב-Vercel:** בדקי ב-**Deployments** → ה-deploy שנכשל → **Building** / **Logs**. וודאי ש־`DATABASE_URL` ו־`NEXTAUTH_SECRET` מוגדרים.
- **שגיאה על מסד נתונים:** וודאי שהרצת `npx prisma db push` עם ה־DATABASE_URL **מ-Neon** (חלק ג׳).
- **ספוטיפיי לא מתחבר:** וודאי שהוספת ב-Spotify את ה-Redirect URI **בדיוק** כמו הכתובת ב-Vercel + `/api/spotify/callback`, ושמרת, והרצת Redeploy אחרי הוספת `NEXT_PUBLIC_APP_URL`.
