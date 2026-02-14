import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function LeaderboardPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const [event, user] = await Promise.all([
    prisma.event.findUnique({
      where: { code },
      select: { id: true, name: true, organizerId: true },
    }),
    getCurrentUser(),
  ]);
  if (!event) notFound();
  const isOrganizer = user?.id === event.organizerId;

  const participants = await prisma.participant.findMany({
    where: { eventId: event.id },
    select: { id: true, name: true },
  });
  const guesses = await prisma.guess.findMany({
    where: { eventId: event.id },
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

  return (
    <main className="min-h-screen p-6 flex flex-col items-center bg-party-mesh" dir="rtl">
      <h1 className="text-3xl font-bold mb-1 text-slate-800">לוח מוביל</h1>
      <p className="text-slate-600 mb-8">{event.name}</p>
      <ul className="w-full max-w-md space-y-3">
        {leaderboard.map((entry, i) => (
          <li
            key={entry.name}
            className={`flex justify-between items-center p-4 rounded-2xl shadow-party transition ${
              i === 0 ? "bg-party-gold/20 border-2 border-party-gold/50 font-bold" : "card-party"
            }`}
          >
            <span>
              <span className="text-party-pink font-mono mr-2">#{i + 1}</span>
              {entry.name}
            </span>
            <span className="font-bold text-party-pink">{entry.correctGuesses} נכונים</span>
          </li>
        ))}
      </ul>
      {isOrganizer ? (
        <Link href="/dashboard" className="mt-8 btn-party-secondary inline-block">
          חזרה לדשבורד
        </Link>
      ) : (
        <Link href="/" className="mt-8 btn-party-secondary inline-block">
          חזרה לדף הבית
        </Link>
      )}
    </main>
  );
}
