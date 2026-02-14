import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { getSpotifyAuthUrl } from "@/lib/spotify";
import { nanoid } from "nanoid";

export async function GET(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const missing =
    !clientId ||
    !clientSecret ||
    clientId.includes("your-") ||
    clientSecret.includes("your-");
  if (missing) {
    const origin = req.nextUrl.origin;
    return NextResponse.redirect(
      `${origin}/dashboard?spotify=error&spotify_error=missing_credentials`
    );
  }
  let origin = req.nextUrl.origin;
  if (origin.startsWith("http://localhost") || origin.startsWith("https://localhost")) {
    origin = origin.replace("localhost", "127.0.0.1");
  }
  const redirectUri = `${origin}/api/spotify/callback`;
  const state = `${userId}:${nanoid(16)}`;
  const url = getSpotifyAuthUrl(redirectUri, state);
  return NextResponse.redirect(url);
}
