import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      playlistSongs: { orderBy: { orderIndex: "asc" }, include: { participant: true } },
    },
  });
  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (event.status !== "playing") {
    return NextResponse.json({ error: "Event not in playing state" }, { status: 400 });
  }
  const { guesserName, chosenName } = await req.json();
  if (!guesserName || !chosenName || typeof guesserName !== "string" || typeof chosenName !== "string") {
    return NextResponse.json({ error: "guesserName and chosenName required" }, { status: 400 });
  }
  const songIndex = event.currentSongIndex;
  const currentPlaylistSong = event.playlistSongs[songIndex];
  if (!currentPlaylistSong) {
    return NextResponse.json({ error: "No current song" }, { status: 400 });
  }
  const guesser = await prisma.participant.findFirst({
    where: { eventId, name: guesserName.trim() },
  });
  const chosen = await prisma.participant.findFirst({
    where: { eventId, name: chosenName.trim() },
  });
  if (!guesser || !chosen) {
    return NextResponse.json({ error: "Participant not found" }, { status: 400 });
  }
  const correctChosenId = currentPlaylistSong.participantId;
  const correct = chosen.id === correctChosenId;
  await prisma.guess.create({
    data: {
      eventId,
      guesserId: guesser.id,
      chosenId: chosen.id,
      songIndex,
      correct,
    },
  });
  return NextResponse.json({ correct });
}
