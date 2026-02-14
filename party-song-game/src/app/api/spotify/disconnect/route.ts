import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * מוחק את הטוקן של ספוטיפיי למשתמש המחובר.
 * אחרי קריאה – יש ללחוץ "התחבר לספוטיפיי" שוב כדי לקבל טוקן חדש.
 */
export async function POST() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await prisma.spotifyToken.deleteMany({ where: { userId } });
  return NextResponse.json({ ok: true });
}
