import { cookies } from "next/headers";
import { prisma } from "./db";
import bcrypt from "bcryptjs";

const SESSION_COOKIE = "party_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** Parse session token from Cookie header (for API routes where cookies() may not see it) */
function getTokenFromCookieHeader(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  return match ? match[1].trim() : null;
}

export async function getSessionUserIdFromCookieHeader(cookieHeader: string | null): Promise<string | null> {
  const token = getTokenFromCookieHeader(cookieHeader);
  return getSessionUserIdFromToken(token);
}

export async function getSessionUserIdFromToken(token: string | null): Promise<string | null> {
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { token },
  });
  if (!session || session.expiresAt < new Date()) return null;
  return session.userId;
}

/** For API routes: try header (from middleware), then Cookie header, then cookies() */
export async function getSessionUserIdForRequest(cookieHeader: string | null, headerToken: string | null): Promise<string | null> {
  return (
    (await getSessionUserIdFromToken(headerToken)) ??
    (await getSessionUserIdFromCookieHeader(cookieHeader)) ??
    (await getSessionUserId())
  );
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<void> {
  const { nanoid } = await import("nanoid");
  const token = nanoid(32);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);
  await prisma.session.create({
    data: { token, userId, expiresAt },
  });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { token },
  });
  if (!session || session.expiresAt < new Date()) return null;
  return session.userId;
}

export async function getCurrentUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });
  return user;
}

export async function logout() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  cookieStore.delete(SESSION_COOKIE);
}
