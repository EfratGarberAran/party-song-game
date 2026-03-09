import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

const SESSION_COOKIE = "party_session";

/**
 * דיבאג סשן – לבדיקה בלבד. פותחים את ה-URL כשמחוברים ומעתיקים את התשובה.
 * GET /api/debug-session
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value ?? null;
  const hasCookie = !!token;

  let sessionValid = false;
  let userId: string | null = null;
  let expiresAt: string | null = null;

  if (token) {
    const session = await prisma.session.findUnique({
      where: { token },
    });
    if (session) {
      sessionValid = session.expiresAt > new Date();
      userId = session.userId;
      expiresAt = session.expiresAt.toISOString();
    }
  }

  const debug = {
    hasCookie,
    tokenLength: token ? token.length : 0,
    sessionValid,
    userId,
    expiresAt,
    env: process.env.VERCEL ? "vercel" : "local",
  };

  return NextResponse.json(debug);
}
