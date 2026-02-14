import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });
  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const participants = await prisma.participant.findMany({
    where: { eventId },
    select: { id: true, name: true },
  });
  const guesses = await prisma.guess.findMany({
    where: { eventId },
    select: { guesserId: true, correct: true },
  });
  const correctByGuesser: Record<string, number> = {};
  for (const p of participants) {
    correctByGuesser[p.id] = 0;
  }
  for (const g of guesses) {
    if (g.correct) {
      correctByGuesser[g.guesserId] = (correctByGuesser[g.guesserId] ?? 0) + 1;
    }
  }
  const leaderboard = participants
    .map((p) => ({
      name: p.name,
      correctGuesses: correctByGuesser[p.id] ?? 0,
    }))
    .sort((a, b) => b.correctGuesses - a.correctGuesses);
  return NextResponse.json({
    eventName: event.name,
    leaderboard,
  });
}
