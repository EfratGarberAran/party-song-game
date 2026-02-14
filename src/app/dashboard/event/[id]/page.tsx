import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { EventDashboardClient } from "./EventDashboardClient";

export default async function EventDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) return null;
  const { id } = await params;
  const event = await prisma.event.findFirst({
    where: { id, organizerId: user.id },
    include: {
      participants: true,
      playlistSongs: { orderBy: { orderIndex: "asc" }, include: { participant: true } },
    },
  });
  if (!event) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const joinUrl = baseUrl + `/event/${event.code}`;
  const playUrl = baseUrl + `/event/${event.code}/play`;

  return (
    <div dir="rtl" className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">{event.name}</h1>
        <p className="text-slate-600 mt-1">{event.question}</p>
      </div>

      {event.status === "collecting" && (
        <>
          <section className="card-party">
            <h2 className="text-lg font-bold mb-3 text-party-pink">סרקו את הקוד כדי להצטרף</h2>
            <img
              src={`/api/events/${event.id}/qr`}
              alt="QR Code"
              className="w-64 h-64 rounded-2xl border-2 border-party-rose/40 shadow-party"
            />
            <p className="mt-3 text-sm text-slate-500">או פתחו את הקישור:</p>
            <a
              href={joinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-party-pink font-medium hover:text-party-coral break-all"
            >
              {joinUrl}
            </a>
          </section>
          <section className="card-party">
            <h2 className="text-lg font-bold mb-3 text-slate-800">משתתפים ({event.participants.length})</h2>
            {event.participants.length === 0 ? (
              <p className="text-slate-500">עדיין אין משתתפים. שתפו את הקוד או הקישור.</p>
            ) : (
              <ul className="space-y-2">
                {event.participants.map((p) => (
                  <li key={p.id} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-party-pink" />
                    {p.name}
                    {p.trackName && (
                      <span className="text-slate-500 text-sm"> – {p.trackName}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      {event.status === "playing" && (
        <section className="card-party">
          <h2 className="text-lg font-bold mb-2 text-party-violet">קישור להצבעה למשתתפים</h2>
          <p className="text-sm text-slate-600 mb-2">
            תגידי למשתתפים לפתוח את הקישור הזה (או להציג על המסך) – שם הם יראו את השיר הנוכחי ויבחרו מי לדעתם בחר אותו.
          </p>
          <a
            href={playUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-party-pink font-medium break-all underline"
          >
            {playUrl}
          </a>
        </section>
      )}

      <EventDashboardClient
        eventId={event.id}
        status={event.status}
        hasSpotifyToken={!!(await prisma.spotifyToken.findUnique({ where: { userId: user.id } }))}
        participantsCount={event.participants.length}
        playlistUrl={event.playlistUrl}
        currentSongIndex={event.currentSongIndex}
        totalSongs={event.playlistSongs.length}
      />

      {event.status === "ended" && (
        <Link
          href={`/event/${event.code}/leaderboard`}
          className="btn-party-primary inline-block"
        >
          צפה בלוח המוביל
        </Link>
      )}
    </div>
  );
}
