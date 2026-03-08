"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EventDashboardClient } from "./EventDashboardClient";

type EventFromApi = {
  id: string;
  name: string;
  question: string;
  code: string;
  status: string;
  playlistUrl: string | null;
  currentSongIndex: number;
  hasSpotifyToken: boolean;
  participants: { id: string; name: string; trackName: string | null }[];
  playlistSongs: { id: string; orderIndex: number; participant: { name: string } | null }[];
};

export function EventPageContent({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<EventFromApi | null>(null);
  const [status, setStatus] = useState<"loading" | "unauthorized" | "notfound" | "ok">("loading");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/events/${eventId}`, { credentials: "include" })
      .then((res) => {
        if (cancelled) return;
        if (res.status === 401) {
          setStatus("unauthorized");
          return;
        }
        if (res.status === 404) {
          setStatus("notfound");
          return;
        }
        if (!res.ok) {
          setStatus("notfound");
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled || !data) return;
        setEvent(data);
        setStatus("ok");
      })
      .catch(() => {
        if (!cancelled) setStatus("notfound");
      });
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  if (status === "loading") {
    return (
      <div dir="rtl" className="space-y-6">
        <div className="card-party animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/2 mb-2" />
          <div className="h-4 bg-slate-100 rounded w-3/4" />
          <div className="h-64 bg-slate-100 rounded-2xl mt-4" />
        </div>
      </div>
    );
  }

  if (status === "unauthorized") {
    return (
      <div dir="rtl" className="space-y-6">
        <div className="card-party">
          <h2 className="text-xl font-bold text-slate-800 mb-2">ההתחברות פגה</h2>
          <p className="text-slate-600 mb-4">
            כדי לראות את האירוע צריך להתחבר שוב.
          </p>
          <Link href="/login" className="btn-party-primary inline-block">
            התחברות
          </Link>
        </div>
      </div>
    );
  }

  if (status === "notfound" || !event) {
    return (
      <div dir="rtl" className="space-y-6">
        <div className="card-party">
          <h2 className="text-xl font-bold text-slate-800 mb-2">האירוע לא נמצא</h2>
          <p className="text-slate-600 mb-4">
            ייתכן שהאירוע לא קיים או שאין לך גישה אליו. נסי לרענן את הדף או לחזור לרשימת האירועים.
          </p>
          <Link href="/dashboard" className="btn-party-primary inline-block">
            חזרה לאירועים שלי
          </Link>
        </div>
      </div>
    );
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
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
        hasSpotifyToken={event.hasSpotifyToken}
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
