# בדיקות כשההתחברות / ספוטיפיי נכשלים

## 1. משתני סביבה ב-Vercel
- היכנסי ל-Vercel → הפרויקט → **Settings** → **Environment Variables**
- חייבת להיות **SPOTIFY_CLIENT_ID** ו-**SPOTIFY_CLIENT_SECRET**
- הערכים חייבים להיות **מאותה אפליקציה** ב-Spotify Developer Dashboard שבה הוספת את ה-Redirect URI
- אם יש לך שתי אפליקציות (למשל אחת ללוקל ואחת ל-production) – ב-Vercel חייבת להיות ה-**Client ID** ו-**Secret** של האפליקציה שבה מופיע:
  `https://party-song-game-1ttc.vercel.app/api/spotify/callback`
- וודאי שהמשתנים מוגדרים ל-**Production** (ולא רק ל-Preview)

## 2. Spotify Developer Dashboard
- [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) → האפליקציה הנכונה
- **Edit Settings** → **Redirect URIs**
- חייב להופיע **בדיוק**: `https://party-song-game-1ttc.vercel.app/api/spotify/callback`
  - עם **https** (לא http)
  - בלי רווח בהתחלה או בסוף
  - בלי סלאש בסוף
- **Save** אחרי כל שינוי

## 3. Cookie אחרי התחברות
- אחרי לוגין, פתחי **DevTools** (F12) → **Application** → **Cookies** → `https://party-song-game-1ttc.vercel.app`
- אמור להופיע **party_session**
- אם אין – הסשן לא נשמר (למשל בעיית HTTPS/domain)

## 4. איך את נכנסת לאתר
- נסי תמיד להיכנס באותה כתובת: `https://party-song-game-1ttc.vercel.app` (בלי www, בלי http)
- אם את נכנסת דרך לינק אחר (למשל עם www או דומיין שונה) – ה-cookie עלול לא לעבוד

## 5. צילומי מסך שכדאי לשלוח אם עדיין נכשל
1. **Vercel → Settings → Environment Variables** – רשימת השמות (לא הערכים) – לוודא ש-SPOTIFY_CLIENT_ID ו-SPOTIFY_CLIENT_SECRET קיימים ל-Production
2. **Spotify Dashboard → האפליקציה → Edit Settings** – החלק של Redirect URIs (שלם)
3. **אחרי לוגין** – DevTools → Application → Cookies – רשימת ה-cookies לאתר
4. **השורה המלאה בדפדפן** כשיש שגיאה (כתובת ה-URL עם כל ה-query parameters)
