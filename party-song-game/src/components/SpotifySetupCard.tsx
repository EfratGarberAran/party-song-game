"use client";

export function SpotifySetupCard() {
  return (
    <div className="card-party border-2 border-party-gold/40 bg-party-gold/5 mb-6" dir="rtl">
      <h3 className="font-bold text-slate-800 mb-2">לפני שמתחברים לספוטיפיי – הגדרה חד־פעמית</h3>
      <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
        <li>
          היכנסי ל־
          <a
            href="https://developer.spotify.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-party-pink font-medium hover:underline"
          >
            Spotify Developer Dashboard
          </a>
          ולחצי <strong>Create app</strong>.
        </li>
        <li>
          מלאי שם אפליקציה (למשל Party Shuffle). ב־<strong>Redirect URI</strong> – ספוטיפיי לא מאפשרים יותר <code className="bg-white/80 px-1 rounded">localhost</code>; יש להשתמש ב־<strong>127.0.0.1</strong>. הוסיפי <strong>בדיוק</strong>:
          <code className="block mt-1 p-2 rounded-lg bg-white/80 text-xs break-all border border-party-pink/20">
            http://127.0.0.1:3000/api/spotify/callback
          </code>
          לחצי Add ואז Save. אחר כך גשי לאתר דרך <strong>http://127.0.0.1:3000</strong> (לא localhost).
        </li>
        <li>
          בדשבורד → Settings: העתיקי את <strong>Client ID</strong> ו־<strong>Client secret</strong> (View client secret).
        </li>
        <li>
          פתחי את קובץ <code className="bg-white/80 px-1 rounded">.env</code> בתיקיית הפרויקט והחליפי:
          <br />
          <code className="block mt-1 p-2 rounded-lg bg-white/80 text-xs border border-party-pink/20">
            SPOTIFY_CLIENT_ID=&quot;הערך-שהעתקת&quot;
            <br />
            SPOTIFY_CLIENT_SECRET=&quot;הערך-שהעתקת&quot;
          </code>
        </li>
        <li>
          עצרי את השרת (Ctrl+C) והריצי שוב <code className="bg-white/80 px-1 rounded">npm run dev</code>.
        </li>
      </ol>
      <p className="mt-3 text-xs text-slate-500">
        מדריך מפורט: קובץ <code className="bg-white/80 px-1 rounded">SPOTIFY_SETUP.md</code> בפרויקט.
      </p>
    </div>
  );
}
