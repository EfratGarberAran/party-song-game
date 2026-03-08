import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/spotify";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

export async function GET(req: NextRequest) {
  let origin = req.nextUrl.origin;
  if (origin.startsWith("http://localhost") || origin.startsWith("https://localhost")) {
    origin = origin.replace("localhost", "127.0.0.1");
  }
  const dashboardUrl = `${origin}/dashboard`;

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  if (error) {
    if (error === "access_denied") {
      return NextResponse.redirect(`${dashboardUrl}?spotify=denied`);
    }
    const params = new URLSearchParams({ spotify: "error" });
    const codeFromError = getSpotifyErrorCode(errorDescription ?? error);
    if (codeFromError) params.set("spotify_error", codeFromError);
    if (errorDescription) params.set("spotify_message", errorDescription.slice(0, 200));
    return NextResponse.redirect(`${dashboardUrl}?${params.toString()}`);
  }
  if (!code || !state) {
    return NextResponse.redirect(`${dashboardUrl}?spotify=error`);
  }
  const stateParts = state.split("|");
  const userId = stateParts.length >= 3 ? stateParts[0] : state.split(":")[0];
  const redirectUriFromState = stateParts.length >= 3 ? decodeURIComponent(stateParts[2]) : null;
  if (!userId) {
    return NextResponse.redirect(`${dashboardUrl}?spotify=error&spotify_error=invalid_state`);
  }

  // Use the exact redirect_uri from the auth request so it matches what Spotify has
  const redirectUri = redirectUriFromState && redirectUriFromState.startsWith("http")
    ? redirectUriFromState
    : `${origin}/api/spotify/callback`;

  // Ensure the user in state matches current session (avoid stale state / wrong user)
  const sessionUserId = await getSessionUserId();
  if (!sessionUserId || sessionUserId !== userId) {
    return NextResponse.redirect(
      `${dashboardUrl}?spotify=error&spotify_error=session_expired&spotify_message=ההתחברות פגה. היכנסי מחדש לאתר ולחצי שוב על התחבר לספוטיפיי.`
    );
  }
  try {
    const tokens = await exchangeCodeForTokens(code, redirectUri);
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);
    await prisma.spotifyToken.upsert({
      where: { userId },
      create: {
        userId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt,
      },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt,
      },
    });
    return NextResponse.redirect(`${dashboardUrl}?spotify=ok`);
  } catch (err) {
    console.error("Spotify callback error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    const spotifyError = getSpotifyErrorCode(msg);
    const params = new URLSearchParams({ spotify: "error" });
    if (spotifyError) params.set("spotify_error", spotifyError);
    try {
      const jsonMatch = msg.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const obj = JSON.parse(jsonMatch[0]);
        if (obj.error_description) {
          params.set("spotify_message", obj.error_description.slice(0, 200));
        }
      }
    } catch (_) {}
    return NextResponse.redirect(`${dashboardUrl}?${params.toString()}`);
  }
}

function getSpotifyErrorCode(message: string | null): string {
  if (!message) return "";
  const m = message.toLowerCase();
  if (m.includes("redirect_uri_mismatch")) return "redirect_uri_mismatch";
  if (m.includes("invalid_client")) return "invalid_client";
  if (m.includes("invalid_grant")) return "invalid_grant";
  if (m.includes("user_not_found") || m.includes("user not found")) return "user_not_found";
  return "";
}
