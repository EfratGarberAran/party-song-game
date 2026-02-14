import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  createPlaylist,
  refreshSpotifyToken,
  getSpotifyUser,
} from "@/lib/spotify";

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { eventId } = await params;
  const event = await prisma.event.findFirst({
    where: { id: eventId, organizerId: userId },
    include: { participants: true },
  });
  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (event.playlistUrl) {
    return NextResponse.json({ error: "Playlist already created" }, { status: 400 });
  }
  const tokenRow = await prisma.spotifyToken.findUnique({
    where: { userId },
  });
  if (!tokenRow) {
    return NextResponse.json({ error: "Connect Spotify first" }, { status: 400 });
  }
  let accessToken = tokenRow.accessToken;
  if (tokenRow.expiresAt < new Date()) {
    const refreshed = await refreshSpotifyToken(tokenRow.refreshToken);
    accessToken = refreshed.access_token;
    await prisma.spotifyToken.update({
      where: { userId },
      data: {
        accessToken,
        expiresAt: new Date(Date.now() + refreshed.expires_in * 1000),
      },
    });
  }
  let spotifyUser: { id: string };
  try {
    spotifyUser = await getSpotifyUser(accessToken);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Create playlist – getSpotifyUser failed:", msg);
    const step1 = "שלב 1 (זיהוי משתמש ספוטיפיי) נכשל. ";
    const short = msg.includes("(403)") ? "ספוטיפיי החזירו 403 Forbidden – וודאי שהתחברת עם חשבון שהוספת ב־User Management, ושהרשאות כוללות גם 'צפייה בפרטי החשבון'. נסי 'התחברי מחדש לספוטיפיי'." : msg.slice(0, 200);
    return NextResponse.json({ error: step1 + short }, { status: 500 });
  }

  try {
    const shuffled = shuffle(event.participants);
    const trackUris = shuffled.map((p) => `spotify:track:${p.trackId}`);
    const playlistName = `Party Game – ${event.name}`;
    const playlist = await createPlaylist(
      accessToken,
      spotifyUser.id,
      playlistName,
      trackUris
    );
    for (let i = 0; i < shuffled.length; i++) {
      const p = shuffled[i];
      await prisma.playlistSong.create({
        data: {
          eventId,
          participantId: p.id,
          orderIndex: i,
          trackId: p.trackId,
          trackName: p.trackName ?? undefined,
          artistName: p.artistName ?? undefined,
        },
      });
    }
    await prisma.event.update({
      where: { id: eventId },
      data: {
        playlistUrl: playlist.external_urls.spotify,
        status: "playing",
      },
    });
    return NextResponse.json({
      playlistUrl: playlist.external_urls.spotify,
      playlistId: playlist.id,
    });
  } catch (err) {
    console.error("Create playlist error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    let userMessage = "יצירת הפלייליסט נכשלה. נסי שוב.";
    if (msg.includes("Failed to refresh Spotify token") || msg.includes("invalid_grant")) {
      userMessage = "פג תוקף החיבור לספוטיפיי. לחצי על 'התחבר לספוטיפיי' שוב.";
    } else if (msg.includes("Create playlist (")) {
      const step2 = "שלב 2 (יצירת פלייליסט) נכשל. ";
      const rest = msg.replace(/^Create playlist \(\d+\):?\s*/, "").trim();
      try {
        const parsed = JSON.parse(rest);
        const desc = parsed?.error?.message ?? parsed?.error_description ?? rest.slice(0, 120);
        userMessage = step2 + (rest.includes("Forbidden") || rest.includes("403") ? "ספוטיפיי החזירו Forbidden – וודאי שהחשבון ב־User Management והרשאות כוללות ניהול פלייליסטים." : desc);
      } catch {
        userMessage = step2 + rest.slice(0, 150);
      }
    } else if (msg.includes("Add tracks (")) {
      const step3 = "שלב 3 (הוספת שירים לפלייליסט) נכשל. ";
      const rest = msg.replace(/^Add tracks \(\d+\):?\s*/, "").trim();
      try {
        const parsed = JSON.parse(rest);
        const desc = parsed?.error?.message ?? parsed?.error_description ?? rest.slice(0, 120);
        userMessage = step3 + (rest.includes("Forbidden") || rest.includes("403") ? "ספוטיפיי החזירו Forbidden – ייתכן ששיר לא זמין באזור שלך." : desc);
      } catch {
        userMessage = step3 + rest.slice(0, 150);
      }
    }
    return NextResponse.json({ error: userMessage }, { status: 500 });
  }
}
