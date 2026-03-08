# מה עשיתי ומה נשאר – משחק השירים מחר

## מה כבר בוצע (כן)

- **הקוד ב-GitHub** – הדחיפה הצליחה. הריפו חי כאן:  
  https://github.com/EfratGarberAran/party-song-game  
  (יש שם את כל הקבצים: `src`, `prisma`, `package.json` וכו'.)

- **קובץ `.env` מקומי** – קיים אצלך בתיקיית הפרויקט (משמש להרצה מקומית).

---

## מה לא ידוע (צריך לבדוק)

- **פריסה ב-Railway** – לא ברור אם פתחת פרויקט ב-Railway, חיברת את הריפו, הוספת PostgreSQL ומשתני סביבה, ויצרת דומיין.  
  **איך בודקים:** היכנסי ל-[railway.app](https://railway.app). אם יש פרויקט עם `party-song-game` ויש לו **כתובת (דומיין)** – כנראה שהפריסה הוגדרה. אם אין פרויקט או אין דומיין – צריך לעשות פריסה לפי `DEPLOY.md`.

---

## איך להשתמש במשחק מחר – שתי אפשרויות

### אפשרות 1: להריץ **מקומית** על המחשב (כולם באותה רשת / אצלך)

מתאים אם המסיבה אצלך והמחשב מחובר לרשת.

1. **וידוא מסד נתונים**  
   צריך ש־`.env` יכיל `DATABASE_URL` חוקי (PostgreSQL – למשל מ־Neon או מ־Railway).  
   אם יש – עוברים ל־2.  
   אם אין או לא בטוחה – אפשר לפתוח מסד חינמי ב-[neon.tech](https://neon.tech), להעתיק את ה־connection string ל־`.env` כ־`DATABASE_URL`.

2. **יצירת הטבלאות (פעם אחת)**  
   בטרמינל, מתוך תיקיית הפרויקט:
   ```bash
   cd /Users/efrataram/party-song-game
   npx prisma db push
   ```

3. **הרצת האפליקציה**  
   ```bash
   npm run dev
   ```
   אחרי שהשרת עולה – לפתוח בדפדפן: **http://localhost:3000** (או הכתובת שהטרמינל מציג).

4. **ספוטיפיי**  
   ב־Spotify Dashboard של האפליקציה, ב־Redirect URIs, חייבת להיות:  
   `http://127.0.0.1:3000/api/spotify/callback`  
   (זה כבר מופיע ב־`.env.example` כ־`NEXT_PUBLIC_APP_URL`.)

**סיכום:** אם `.env` מלא ו־`npx prisma db push` כבר רצת פעם – מחר מספיק להריץ `npm run dev` ולפתוח http://localhost:3000.

---

### אפשרות 2: שהמשחק יהיה **באינטרנט** (כולם נכנסים מלינק)

מתאים אם משתתפים ייכנסו מהטלפון/מחשב מכל מקום.

צריך **לסיים את כל שלבי הפריסה** ב־`DEPLOY.md`:

1. **חלק א׳** – Railway: פרויקט חדש + PostgreSQL, להעתיק `DATABASE_URL`.
2. **חלק ב׳** – חיבור הריפו מ-GitHub (party-song-game).
3. **חלק ג׳** – Variables: `DATABASE_URL`, `NEXTAUTH_SECRET`, `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`.
4. **חלק ד׳** – אצלך בטרמינל: `DATABASE_URL="הערך-מ-Railway" npx prisma db push`.
5. **חלק ה׳** – ב-Railway: Generate Domain, להוסיף משתנה `NEXT_PUBLIC_APP_URL` עם הכתובת.
6. **חלק ו׳** – ב-Spotify: להוסיף Redirect URI בדיוק:  
   `https://הכתובת-שלך.up.railway.app/api/spotify/callback`

אחרי שכל ששת החלקים בוצעו – נכנסים לכתובת ש-Railway נותן (למשל `https://party-song-game-production-xxxx.up.railway.app`) ומשתמשים במשחק משם.

---

## טבלת בדיקה מהירה

| משימה | בוצע? | הערה |
|--------|--------|------|
| קוד ב-GitHub | ✅ | EfratGarberAran/party-song-game |
| .env מקומי | ✅ | קיים (לא נבדק תוכן) |
| מסד נתונים (מקומי או Railway) | ? | אם יש DATABASE_URL ב-.env – כנראה כן |
| `npx prisma db push` | ? | אם לא הרצת – להריץ פעם אחת |
| פריסה ב-Railway (דומיין חי) | ? | לבדוק ב־railway.app |
| Redirect URI בספוטיפיי לכתובת החיה | ? | רק אם בחרת באפשרות 2 |

---

**למחר – הכי פשוט:**  
אם את רק רוצה שהמשחק יעבוד אצלך על המחשב – וודאי ש־`.env` מלא, הריצי `npx prisma db push` (פעם אחת), ואז `npm run dev` ופתחי http://localhost:3000.  
אם את רוצה שכתובת באינטרנט תעבוד – עברי ב־Railway ו־DEPLOY.md ובדקי שכל 6 החלקים בוצעו.
