import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
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
    include: { playlistSongs: { orderBy: { orderIndex: "asc" } } },
  });
  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const nextIndex = event.currentSongIndex + 1;
  if (nextIndex >= event.playlistSongs.length) {
    await prisma.event.update({
      where: { id: eventId },
      data: { status: "ended" },
    });
    return NextResponse.json({ status: "ended", currentSongIndex: nextIndex - 1 });
  }
  await prisma.event.update({
    where: { id: eventId },
    data: { currentSongIndex: nextIndex },
  });
  const nextSong = event.playlistSongs[nextIndex];
  return NextResponse.json({
    status: "playing",
    currentSongIndex: nextIndex,
    currentSong: nextSong
      ? {
          trackName: nextSong.trackName,
          artistName: nextSong.artistName,
        }
      : null,
  });
}
