import { NextRequest, NextResponse } from "next/server";
import { getSessionUserIdForRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const userId = await getSessionUserIdForRequest(
    req.headers.get("cookie"),
    req.headers.get("x-party-session-token")
  );
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { eventId } = await params;
  const event = await prisma.event.findFirst({
    where: { id: eventId, organizerId: userId },
    include: {
      participants: true,
      playlistSongs: { orderBy: { orderIndex: "asc" }, include: { participant: true } },
    },
  });
  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const hasSpotifyToken = !!(await prisma.spotifyToken.findUnique({
    where: { userId },
  }));
  return NextResponse.json({ ...event, hasSpotifyToken });
}
