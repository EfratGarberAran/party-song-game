# הגדרת התחברות לספוטיפיי

כדי שהאפליקציה תוכל ליצור פלייליסטים בחשבון הספוטיפיי שלך, צריך ליצור אפליקציה אחת ב-Spotify Developer ולהעתיק מפתחות.

## 1. יצירת אפליקציה ב-Spotify

1. היכנסי ל־[Spotify Developer Dashboard](https://developer.spotify.com/dashboard) והתחברי עם חשבון הספוטיפיי שלך.
2. לחצי **"Create app"** (כפתור סגול).
3. במסך ההגדרות מלאי:
   - **App name** – כל שם (למשל `Party Song Game`).
   - **App description** – אופציונלי.
   - **Redirect URI** – **חשוב:** מספוטיפיי 2025 מותר רק כתובת מאובטחת. לפיתוח מקומי יש להשתמש ב־**127.0.0.1** (לא localhost). לחצי "Add" והדביקי **בדיוק**:
     ```
     http://127.0.0.1:3000/api/spotify/callback
     ```
     אחרי השמירה – גשי לאתר דרך **http://127.0.0.1:3000** (לא localhost).
4. סמני את תיבת התנאים ולחצי **Save**.

## 2. העתקת מפתחות ל-.env

1. בדשבורד, לחצי על האפליקציה שיצרת (או **Settings** אם את כבר בתוכה).
2. העתיקי:
   - **Client ID** (מופיע בדף).
   - **Client secret** – לחצי **"View client secret"**, העתיקי את הערך.
3. בפרויקט `party-song-game` פתחי את קובץ **`.env`** (אם אין – העתיקי מ-`.env.example` ופתחי).
4. עדכני או הוסיפי את השורות (בלי רווחים מיותרים מסביב ל־=):
   ```
   SPOTIFY_CLIENT_ID="הערך-שהעתקת"
   SPOTIFY_CLIENT_SECRET="הערך-שהעתקת"
   ```

דוגמה ל-.env:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="generate-a-random-secret"
SPOTIFY_CLIENT_ID="abc123..."
SPOTIFY_CLIENT_SECRET="xyz789..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**חשוב לפיתוח מקומי:** שימי ב-.env:
`NEXT_PUBLIC_APP_URL="http://127.0.0.1:3000"`
ואז תמיד פתחי את האתר בכתובת **http://127.0.0.1:3000** (לא localhost) – כך ספוטיפיי יאשרו את ההתחברות.

## 3. הפעלה מחדש

אחרי שינוי `.env` – עצרי את שרת הפיתוח (Ctrl+C) והריצי שוב:

```bash
npm run dev
```

ואז נסי שוב "התחבר לספוטיפיי" מאירוע.
