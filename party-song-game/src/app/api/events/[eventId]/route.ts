import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
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
    include: {
      participants: true,
      playlistSongs: { orderBy: { orderIndex: "asc" }, include: { participant: true } },
    },
  });
  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(event);
}
