import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "party_session";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  if (host.startsWith("localhost")) {
    const url = req.nextUrl.clone();
    url.hostname = "127.0.0.1";
    return NextResponse.redirect(url);
  }

  // העברת ה-session token ל-API דרך header (פתרון ל-Vercel שלא תמיד מעביר Cookie)
  const cookieHeader = req.headers.get("cookie");
  const match = cookieHeader?.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  const token = match ? match[1].trim() : null;

  const requestHeaders = new Headers(req.headers);
  if (token) {
    requestHeaders.set("x-party-session-token", token);
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}
