import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      playlistSongs: { orderBy: { orderIndex: "asc" }, include: { participant: true } },
      participants: { select: { id: true, name: true } },
    },
  });
  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const currentSong = event.playlistSongs[event.currentSongIndex] ?? null;
  const participantNames = event.participants.map((p) => p.name);
  return NextResponse.json({
    status: event.status,
    currentSongIndex: event.currentSongIndex,
    totalSongs: event.playlistSongs.length,
    currentSong: currentSong
      ? {
          trackName: currentSong.trackName,
          artistName: currentSong.artistName,
          participantNames: participantNames.sort(() => Math.random() - 0.5),
        }
      : null,
    playlistUrl: event.playlistUrl,
  });
}
