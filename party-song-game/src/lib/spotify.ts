const SPOTIFY_AUTH = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN = "https://accounts.spotify.com/api/token";
const SPOTIFY_API = "https://api.spotify.com/v1";

const SCOPES = "user-read-private playlist-modify-public playlist-modify-private";

export function getSpotifyAuthUrl(redirectUri: string, state: string): string {
  const params = new URLSearchParams();
  params.set("client_id", process.env.SPOTIFY_CLIENT_ID!);
  params.set("response_type", "code");
  params.set("redirect_uri", redirectUri);
  params.set("scope", SCOPES);
  params.set("state", state);
  return `${SPOTIFY_AUTH}?${params.toString()}`;
}

export async function exchangeCodeForTokens(
  code: string,
  redirectUri: string
): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
  const res = await fetch(SPOTIFY_TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: process.env.SPOTIFY_CLIENT_ID!,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Spotify token error: ${err}`);
  }
  return res.json();
}

export async function refreshSpotifyToken(refreshToken: string): Promise<{
  access_token: string;
  expires_in: number;
}> {
  const res = await fetch(SPOTIFY_TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: process.env.SPOTIFY_CLIENT_ID!,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
    }),
  });
  if (!res.ok) throw new Error("Failed to refresh Spotify token");
  return res.json();
}

/**
 * יוצר פלייליסט עבור המשתמש המחובר.
 * משתמש ב־POST /me/playlists (ספוטיפיי עדכנו את ה-API בפברואר 2026).
 */
export async function createPlaylist(
  accessToken: string,
  _userId: string,
  name: string,
  trackUris: string[]
): Promise<{ id: string; external_urls: { spotify: string } }> {
  const createRes = await fetch(`${SPOTIFY_API}/me/playlists`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      public: true,
    }),
  });
  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Create playlist (${createRes.status}): ${err}`);
  }
  const playlist = await createRes.json();

  if (trackUris.length > 0) {
    const addRes = await fetch(`${SPOTIFY_API}/playlists/${playlist.id}/items`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris: trackUris }),
    });
    if (!addRes.ok) {
      const err = await addRes.text();
      throw new Error(`Add tracks (${addRes.status}): ${err}`);
    }
  }

  return playlist;
}

export async function getSpotifyUser(accessToken: string): Promise<{ id: string }> {
  const res = await fetch(`${SPOTIFY_API}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Get user (${res.status}): ${body}`);
  }
  return res.json();
}

export function parseSpotifyTrackId(urlOrId: string): string | null {
  const trimmed = urlOrId.trim();
  const match = trimmed.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9]{22}$/.test(trimmed)) return trimmed;
  return null;
}
