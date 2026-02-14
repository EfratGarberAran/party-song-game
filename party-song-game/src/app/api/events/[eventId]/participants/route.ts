import { NextRequest, NextResponse } from "next/server";
import { parseSpotifyTrackId } from "@/lib/spotify";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }
  if (event.status !== "collecting") {
    return NextResponse.json({ error: "Event no longer accepting submissions" }, { status: 400 });
  }
  const { name, spotifyLink } = await req.json();
  if (!name || !spotifyLink || typeof name !== "string" || typeof spotifyLink !== "string") {
    return NextResponse.json({ error: "Name and Spotify link required" }, { status: 400 });
  }
  const trackId = parseSpotifyTrackId(spotifyLink);
  if (!trackId) {
    return NextResponse.json({ error: "Invalid Spotify track link" }, { status: 400 });
  }
  const participant = await prisma.participant.create({
    data: {
      eventId,
      name: name.trim(),
      trackId,
    },
  });
  return NextResponse.json(participant);
}
