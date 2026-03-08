# Party Shuffle

Everyone picks a song. Guess who picked what.  
משחק שירים במסיבות – אירועים חברתיים אינטראקטיביים עם בחירת שירים, פלייליסט בספוטיפיי וניחוש "מי בחר".

## Features

- **מארגן:** הרשמה, יצירת אירוע, שאלה (מוכנה או מותאמת), קוד QR, התחברות ספוטיפיי, יצירת פלייליסט אקראי, שליטה ב"שיר חדש התחיל", סיום אירוע, לוח מוביל.
- **משתתף:** סריקת QR, הזנת שם והדבקת לינק שיר מספוטיפיי, ניחוש "מי בחר את השיר" בכל שיר, צפייה בלוח מוביל.

## Tech Stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Prisma + SQLite
- Spotify Web API (OAuth, create playlist)
- Session auth via cookies

## Setup

1. Clone and install:
   ```bash
   cd party-song-game
   npm install
   ```

2. Copy env and configure:
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   - `DATABASE_URL="file:./dev.db"`
   - `NEXTAUTH_SECRET` – any random string (for session)
   - `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` – from [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Add redirect URI: `http://localhost:3000/api/spotify/callback`
   - `NEXT_PUBLIC_APP_URL="http://localhost:3000"`

3. Init DB:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Run:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

## Flow

1. Organizer signs up, creates event, picks question, shares QR/link.
2. Participants open link, enter name and Spotify track link, submit.
3. Organizer connects Spotify, clicks "Create playlist" – playlist is created in random order.
4. Organizer plays the playlist in Spotify (external). For each song, organizer clicks "שיר חדש התחיל" in the app.
5. Participants see "Who chose this song?" and pick a name; they can submit one guess per song.
6. Organizer ends event; everyone can view the leaderboard (most correct guesses wins).

## i18n

Hebrew (RTL) and English are supported via `src/lib/i18n.ts`. UI currently uses Hebrew by default.
