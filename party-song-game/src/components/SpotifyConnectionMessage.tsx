"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function SpotifyConnectionMessage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const spotify = searchParams.get("spotify");
  const spotifyError = searchParams.get("spotify_error");
  const spotifyMessage = searchParams.get("spotify_message");
  const isOk = spotify === "ok";
  const isDenied = spotify === "denied";
  const isError = spotify === "error";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!spotify || (!isOk && !isDenied && !isError)) return;
    const cleanUrl = window.location.pathname;
    const t = setTimeout(() => {
      router.replace(cleanUrl, { scroll: false });
    }, 15000);
    return () => clearTimeout(t);
  }, [spotify, router, isOk, isDenied, isError]);

  if (!mounted || !spotify) return null;

  if (isOk) {
    return (
      <div className="mb-4 p-4 rounded-2xl bg-party-rose/40 text-party-pink border-2 border-party-pink/30">
        <strong>ההתחברות לספוטיפיי הצליחה.</strong> אפשר ליצור פלייליסט מאירוע.
      </div>
    );
  }

  if (isDenied) {
    return (
      <div className="mb-4 p-4 rounded-2xl bg-party-gold/20 text-amber-900 border-2 border-party-gold/40">
        <strong>ההתחברות לספוטיפיי בוטלה.</strong> אם תרצי ליצור פלייליסט, לחצי שוב על &quot;התחבר לספוטיפיי&quot; ואשרי את הגישה.
      </div>
    );
  }

  if (isError) {
    const isRedirectMismatch = spotifyError === "redirect_uri_mismatch";
    const isInvalidClient = spotifyError === "invalid_client";
    const isMissingCredentials = spotifyError === "missing_credentials";
    const isInvalidGrant = spotifyError === "invalid_grant";
    const isUserNotFound = spotifyError === "user_not_found";
    const isSessionExpired = spotifyError === "session_expired";
    const callbackUri =
      typeof window !== "undefined"
        ? `${window.location.origin}/api/spotify/callback`
        : "http://127.0.0.1:3000/api/spotify/callback";
    const suggestedCallback =
      typeof window !== "undefined" && window.location.hostname === "localhost"
        ? "http://127.0.0.1:3000/api/spotify/callback"
        : callbackUri;

    return (
      <div className="mb-4 p-4 rounded-2xl bg-party-rose/50 text-slate-800 border-2 border-party-coral/40" dir="rtl">
        <strong>ההתחברות לספוטיפיי נכשלה.</strong>
        {spotifyMessage && (
          <p className="mt-2 text-sm font-medium bg-white/80 p-2 rounded">
            ספוטיפיי החזירו: &quot;{spotifyMessage}&quot;
          </p>
        )}
        {spotifyError && (
          <p className="mt-2 text-sm font-medium">
            שגיאת ספוטיפיי:{" "}
            <span className="bg-party-rose/50 px-1 rounded">
              {isRedirectMismatch &&
                "Redirect URI לא תואם – וודאי שפתחת את האתר ב־http://127.0.0.1:3000 (לא localhost) וב־Dashboard ה־URI הוא http://127.0.0.1:3000/api/spotify/callback."}
              {isInvalidClient &&
                "Client ID או Client Secret שגויים – וודאי שהעתקת נכון מ־Dashboard."}
              {isMissingCredentials &&
                "חסרים SPOTIFY_CLIENT_ID או SPOTIFY_CLIENT_SECRET – הוספי אותם ל־.env."}
              {isInvalidGrant &&
                "הקוד פג תוקף או כבר נוצל – נסי שוב מלחיצה על התחבר לספוטיפיי."}
              {isUserNotFound &&
                "המשתמש לא נמצא – וודאי שמתחברים לספוטיפיי עם אותו חשבון שמופיע ב־User Management בדשבורד (אותו אימייל). וודאי ש־Redirect URI בדשבורד תואם בדיוק לכתובת האתר."}
              {isSessionExpired &&
                "ההתחברות לאתר פגה – היכנסי מחדש לאתר ולחצי שוב על התחבר לספוטיפיי."}
              {!["redirect_uri_mismatch", "invalid_client", "missing_credentials", "invalid_grant", "user_not_found", "session_expired"].includes(
                spotifyError
              ) && spotifyError}
            </span>
          </p>
        )}
        {isMissingCredentials ? (
          <ul className="mt-2 list-disc list-inside text-sm space-y-1">
            <li>
              צרי אפליקציה ב־<a href="https://developer.spotify.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">Spotify Developer Dashboard</a> (או השתמשי באפליקציה קיימת).
            </li>
            <li>
              היכנסי ל־&quot;Edit Settings&quot; והוספי ב־<strong>Redirect URIs</strong>:{" "}
              <code className="block mt-1 bg-white/80 p-2 rounded-lg text-xs break-all border border-party-pink/20">
                {suggestedCallback}
              </code>
            </li>
            <li>
              העתיקי <code className="bg-white/80 px-1 rounded">Client ID</code> ו־<code className="bg-white/80 px-1 rounded">Client Secret</code> ל־<code className="bg-white/80 px-1 rounded">.env</code> בתיקיית הפרויקט (בשורות SPOTIFY_CLIENT_ID ו־SPOTIFY_CLIENT_SECRET).
            </li>
            <li>שמרי את .env, הפעילי מחדש את השרת (<code>npm run dev</code>), ונסי שוב.</li>
            <li>
              לבדיקה: פתחי את הקישור{" "}
              <a href="http://127.0.0.1:3000/api/spotify/env-check" target="_blank" rel="noopener noreferrer" className="underline">
                http://127.0.0.1:3000/api/spotify/env-check
              </a>{" "}
              – אם מופיע <code className="bg-white/80 px-1 rounded">ok: true</code> המשתנים נטענו.
            </li>
          </ul>
        ) : (
          <>
            {!isRedirectMismatch && typeof window !== "undefined" && window.location.hostname === "localhost" && (
              <p className="mt-2 text-sm font-bold text-party-violet">
                את כרגע על localhost – ספוטיפיי דוחים. נסי לפתוח:{" "}
                <strong className="break-all">http://127.0.0.1:3000</strong> ולחצי שוב על &quot;התחבר לספוטיפיי&quot;.
              </p>
            )}
            <ul className="mt-2 list-disc list-inside text-sm space-y-1">
              {(isInvalidClient || !spotifyError) && (
                <li>
                  וודאי שבקובץ <code className="bg-white/80 px-1 rounded">.env</code> מופיעים{" "}
                  <code className="bg-white/80 px-1 rounded">SPOTIFY_CLIENT_ID</code> ו־
                  <code className="bg-white/80 px-1 rounded">SPOTIFY_CLIENT_SECRET</code> האמיתיים (מהדשבורד, לא placeholder).
                </li>
              )}
              <li>
                היכנסי ל־<a href="https://developer.spotify.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">Spotify Developer Dashboard</a> → האפליקציה → &quot;Edit Settings&quot;.
              </li>
              {(isRedirectMismatch || !spotifyError) && (
                <li>
                  ב־<strong>Redirect URIs</strong> חייבת להופיע <strong>בדיוק</strong>:{" "}
                  <code className="block mt-1 bg-white/80 p-2 rounded-lg text-xs break-all border border-party-pink/20">
                    {suggestedCallback}
                  </code>
                  (לא localhost – ספוטיפיי לא מקבלים localhost).
                </li>
              )}
              <li>שמרי את ההגדרות, הפעילי מחדש את השרת (<code>npm run dev</code>), ונסי שוב.</li>
            </ul>
          </>
        )}
      </div>
    );
  }

  return null;
}
