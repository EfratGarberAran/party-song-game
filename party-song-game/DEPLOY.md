# הדרכה צעד־אחר־צעד: להעלות את משחק השירים לאינטרנט (חינם)

המדריך מניח שאת מתחילה מאפס. כל שלב מסומן במספר – עברי לפי הסדר.

---

## לפני שמתחילים – מה צריך להיות מוכן

1. **הקוד ב-GitHub** (פעם אחת)
   - **בטרמינל:** פתחי טרמינל **בתיקיית הפרויקט** `party-song-game` והריצי:
     ```bash
     bash scripts/setup-git.sh
     ```
     הסקריפט יוצר ריפו מקומי ועושה commit ראשון. בסוף הוא יראה לך בדיוק מה להריץ בהמשך.
   - **בדפדפן:** היכנסי ל-[github.com/new](https://github.com/new). שם Repository: `party-song-game`. **אל תסמני** "Add a README file" – לחצי **Create repository**.
   - **חזרה לטרמינל** (החליפי `YOUR-USERNAME` בשם המשתמש שלך ב-GitHub):
     ```bash
     git remote add origin https://github.com/YOUR-USERNAME/party-song-game.git
     git branch -M main
     git push -u origin main
     ```
   אחרי ה־push הקוד יהיה ב-GitHub.

2. **חשבון Railway**  
   היכנסי ל-[railway.app](https://railway.app) והתחברי (למשל עם GitHub). זה חינם.

3. **אפליקציית ספוטיפיי**  
   כבר יש לך – תשתמשי באותם Client ID ו-Client Secret.

---

# חלק א׳: מסד הנתונים ב-Railway

## צעד 1.1 – פתיחת פרויקט חדש

1. גלשי ל-[railway.app](https://railway.app) והיכנסי.
2. אם יש לך כבר פרויקטים – לחצי **"New Project"** (כפתור בולט).
3. אם זו הפעם הראשונה – יופיעו אופציות ליצירת פרויקט. מחפשים את **"Create from template"** או **"Empty Project"** או **"Deploy PostgreSQL"**.

## צעד 1.2 – הוספת PostgreSQL

1. אם בחרת **"Empty Project"** – בתוך הפרויקט תראי כפתור **"New"** או **"+ New"**. לחצי עליו.
2. בחרי **"Database"** או **"Plugin"** ואז **"PostgreSQL"** (או **"Add PostgreSQL"**).
3. אם יש אופציה **"Deploy PostgreSQL"** כבר בתפריט – לחצי עליה.
4. Railway יתחיל ליצור שירות. אחרי כמה שניות יופיע שירות עם שם כמו **"PostgreSQL"** או **"postgres"**.

## צעד 1.3 – העתקת כתובת מסד הנתונים (DATABASE_URL)

1. **לחצי על השירות PostgreSQL** (הכרטיס/השורה שלו).
2. ייפתח מסך של השירות. חפשי טאב בשם **"Variables"** או **"Data"** או **"Connect"** – ולחצי עליו.
3. חפשי משתנה בשם **`DATABASE_URL`** (או **`DATABASE_PRIVATE_URL`**). הערך מתחיל בדרך כלל ב־`postgresql://`.
4. **לחצי על הערך** (או על אייקון העתקה לידו) והעתיקי את כל המחרוזת. שמרי אותה במסמך או בקובץ – תצטרכי אותה בשלב 3.

אם לא מופיע `DATABASE_URL` – חפשי **"Connection string"** או **"Postgres connection URL"** והעתיקי את הכתובת המלאה.

---

# חלק ב׳: חיבור הקוד מ-GitHub ופריסת האפליקציה

## צעד 2.1 – הוספת שירות מהריפו

1. חזרי ל-**דף הפרויקט** (למעלה יש בדרך כלל את שם הפרויקט – לחצי עליו אם צריך).
2. לחצי שוב **"New"** או **"+ New"**.
3. בחרי **"GitHub Repo"** (או **"Deploy from GitHub"**).
4. אם מתבקש – **אשרי גישה ל-GitHub** (Authorize Railway).
5. **בחרי את הריפו** של משחק השירים (למשל `party-song-game`). אם הוא לא מופיע – בדקי שהדחיפה ל-GitHub בוצעה (צעד "לפני שמתחילים").

## צעד 2.2 – בדיקת ההגדרות

1. אחרי שבחרת את הריפו, Railway ייצור שירות חדש (כרטיס נוסף בפרויקט).
2. **לחצי על השירות של האפליקציה** (לא על PostgreSQL) – זה השירות ששמו כמו שם הריפו.
3. חפשי **"Settings"** או **"Configure"**.
4. וודאי ש:
   - **Root Directory** – ריק או `./` (אם הקוד בשורש הריפו).
   - **Build Command** – `npm run build` או ריק (ברירת מחדל).
   - **Start Command** – `npm start` או ריק.
5. אם שינית משהו – שמרי.

עדיין **לא** נותנים דומיין – זה יבוא אחרי שמגדירים משתנים.

---

# חלק ג׳: משתני הסביבה (Variables)

## צעד 3.1 – פתיחת Variables של האפליקציה

1. **בשירות של האפליקציה** (לא PostgreSQL), לחצי עליו.
2. חפשי טאב **"Variables"** (או **"Environment"**) – ולחצי.

## צעד 3.2 – הוספת המשתנים אחד־אחד

לחצי **"Add Variable"** או **"New Variable"** והוסיפי את כולם (שם משמאל, ערך מימין):

| שם (בדיוק ככה) | מאיפה לקחת את הערך |
|----------------|---------------------|
| `DATABASE_URL` | ההעתקה מ־PostgreSQL (צעד 1.3). מתחיל ב־`postgresql://` |
| `NEXTAUTH_SECRET` | פתחי [generate-secret.vercel.app/32](https://generate-secret.vercel.app/32), לחצי Generate, והעתיקי. או כתבי מחרוזת אקראית ארוכה (למשל 32 תווים) |
| `SPOTIFY_CLIENT_ID` | מהדשבורד של ספוטיפיי – Client ID של האפליקציה |
| `SPOTIFY_CLIENT_SECRET` | מהדשבורד של ספוטיפיי – Client Secret |

**עדיין לא** מוסיפים `NEXT_PUBLIC_APP_URL` – נוסיף אחרי שיהיה דומיין (חלק ה׳).

לחצי **Save** או **Update** אם יש כפתור כזה. Railway ירוץ build מחדש – אפשר להמתין.

---

# חלק ד׳: יצירת הטבלאות במסד (פעם אחת)

## צעד 4.1 – פתיחת טרמינל במחשב

1. פתחי **טרמינל** (או Terminal / CMD) **בתיקיית הפרויקט** של משחק השירים (איפה שנמצאים `package.json` ו־`prisma`).

## צעד 4.2 – הרצת הפקודה

1. הדביקי את ה־**DATABASE_URL** שהעתקת (משלב 1.3) במקום `הדבקי-כאן-את-DATABASE_URL`:

   **ב-Mac/Linux:**
   ```bash
   DATABASE_URL="הדבקי-כאן-את-DATABASE_URL" npx prisma db push
   ```

   **ב-Windows (PowerShell):**
   ```powershell
   $env:DATABASE_URL="הדבקי-כאן-את-DATABASE_URL"; npx prisma db push
   ```

2. לחצי Enter.
3. אם מופיעות הודעות על עדכון המסד (או "Your database is now in sync") – הצליח. אם מופיעה שגיאה – בדקי שההעתקה של `DATABASE_URL` שלמה (מתחילה ב־`postgresql://` ובלי רווחים מיותרים).

---

# חלק ה׳: קבלת כתובת לאתר (דומיין)

## צעד 5.1 – הפעלת דומיין ב-Railway

1. ב-Railway, **בשירות של האפליקציה** (לא PostgreSQL).
2. חפשי **"Settings"** ואז **"Networking"** או **"Public Networking"**, או כפתור **"Generate Domain"**.
3. לחצי **"Generate Domain"** (או **"Expose"** / **"Create public URL"**).
4. Railway ייצור כתובת, למשל:  
   `party-song-game-production-xxxx.up.railway.app`

## צעד 5.2 – העתקת הכתובת

1. **העתיקי את הכתובת המלאה** (כולל החלק לפני `.up.railway.app`).
2. וודאי שמוסיפים **`https://`** בהתחלה, בלי סלאש בסוף.  
   דוגמה: `https://party-song-game-production-xxxx.up.railway.app`

## צעד 5.3 – הוספת המשתנה NEXT_PUBLIC_APP_URL

1. בשירות האפליקציה, היכנסי שוב ל-**Variables**.
2. לחצי **"Add Variable"** (או **"New Variable"**).
3. **שם:** `NEXT_PUBLIC_APP_URL`  
   **ערך:** הכתובת שהעתקת, עם `https://` ובלי סלאש בסוף.  
   דוגמה: `https://party-song-game-production-xxxx.up.railway.app`
4. שמרי. Railway יריץ build מחדש – חכי עד שיסתיים.

---

# חלק ו׳: עדכון ספוטיפיי (Redirect URI)

## צעד 6.1 – פתיחת ההגדרות של האפליקציה בספוטיפיי

1. היכנסי ל-[developer.spotify.com/dashboard](https://developer.spotify.com/dashboard).
2. בחרי את **האפליקציה** של משחק השירים.
3. לחצי **"Settings"** (או "Edit Settings").

## צעד 6.2 – הוספת Redirect URI לכתובת החדשה

1. גללי ל-**"Redirect URIs"**.
2. בשדה להזנת URI, הזיני **בדיוק** (החליפי בכתובת האמיתית שלך מ-Railway):
   ```
   https://הכתובת-שלך.up.railway.app/api/spotify/callback
   ```
   דוגמה: אם הכתובת היא `https://party-song-game-production-abc1.up.railway.app`, אז:
   ```
   https://party-song-game-production-abc1.up.railway.app/api/spotify/callback
   ```
3. לחצי **"Add"** (אם יש) ואז **"Save"**.

מעכשיו התחברות לספוטיפיי תעבוד גם מהאתר החי.

---

# סיום – איך נכנסים לאתר

1. ב-Railway, בשירות האפליקציה, תחת **Networking** / הדומיין – תופיע הכתובת.
2. **לחצי עליה** (או העתיקי לדפדפן) – זה האתר החי.
3. משתתפים יכולים להיכנס מכל מכשיר לכתובת הזו (למשל דרך קישור או QR שתשלחי).

---

# אם משהו לא עובד

- **האתר לא נטען / 502:** חכי 2–3 דקות אחרי ה-build ונסי שוב. בדקי ב-**Deployments** או **Logs** שאין שגיאות.
- **"התחבר לספוטיפיי" לא עובד:** וודאי שהוספת ב-Spotify את ה-Redirect URI **בדיוק** כמו ב־`NEXT_PUBLIC_APP_URL` + `/api/spotify/callback`, ושמרת.
- **שגיאה על מסד נתונים:** וודאי שהרצת `npx prisma db push` עם ה־DATABASE_URL של Railway (חלק ד׳),משתנה `DATABASE_URL` מוגדר ב-Variables של **האפליקציה** (לא רק של PostgreSQL).

---

**הכל במדריך הזה משתמש בתכניות החינמיות של Railway.** אם תעברי בעתיד לתשלום, ההגדרות נשארות אותו דבר.
