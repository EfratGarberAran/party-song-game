import { NextResponse } from "next/server";

/**
 * בדיקה אם משתני הספוטיפיי נטענו בשרת (בלי לחשוף ערכים).
 * פתחי: http://127.0.0.1:3000/api/spotify/env-check
 */
export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const hasId = !!clientId && !clientId.includes("your-");
  const hasSecret = !!clientSecret && !clientSecret.includes("your-");
  const ok = hasId && hasSecret;
  // אורך הערך (0 = לא נטען) – בלי לחשוף את התוכן
  const secretLen = clientSecret?.length ?? 0;
  return NextResponse.json({
    ok,
    hasClientId: hasId,
    hasClientSecret: hasSecret,
    clientSecretLength: secretLen,
    hint: ok
      ? "המשתנים נטענו. אם ההתחברות עדיין נכשלת – וודאי ש־Redirect URI בדשבורד של ספוטיפיי הוא בדיוק: http://127.0.0.1:3000/api/spotify/callback"
      : "המשתנים לא נטענו. וודאי: 1) הקובץ .env בתיקיית party-song-game. 2) יש שורות SPOTIFY_CLIENT_ID=... ו-SPOTIFY_CLIENT_SECRET=... 3) עצרת והפעלת מחדש את השרת (npm run dev).",
  });
}
