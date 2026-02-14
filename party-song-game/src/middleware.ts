import { NextRequest, NextResponse } from "next/server";

// Spotify דורשים 127.0.0.1 (לא localhost) – מפנים אוטומטית
export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  if (host.startsWith("localhost")) {
    const url = req.nextUrl.clone();
    url.hostname = "127.0.0.1";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
