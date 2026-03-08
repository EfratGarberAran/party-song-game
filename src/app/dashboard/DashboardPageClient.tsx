"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Suspense } from "react";
import { SpotifyConnectionMessage } from "@/components/SpotifyConnectionMessage";

type EventItem = {
  id: string;
  name: string;
  code: string;
  status: string;
  _count: { participants: number };
};

export function DashboardPageClient() {
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/events", { credentials: "include" })
      .then((res) => {
        if (cancelled) return;
        if (!res.ok) return [];
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setEvents(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => {
        if (!cancelled) setEvents([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div>
        <Suspense fallback={null}>
          <SpotifyConnectionMessage />
        </Suspense>
        <h1 className="text-3xl font-bold mb-2 text-slate-800">האירועים שלי</h1>
        <p className="text-slate-600 mb-6">נהלי את המסיבות והמשחקים</p>
        <div className="card-party animate-pulse h-48 rounded-2xl" />
      </div>
    );
  }

  return (
    <div>
      <Suspense fallback={null}>
        <SpotifyConnectionMessage />
      </Suspense>
      <h1 className="text-3xl font-bold mb-2 text-slate-800">האירועים שלי</h1>
      <p className="text-slate-600 mb-6">נהלי את המסיבות והמשחקים</p>
      <Link
        href="/dashboard/new"
        className="btn-party-primary inline-flex items-center gap-2 mb-8"
      >
        אירוע חדש
      </Link>
      {!events || events.length === 0 ? (
        <div className="card-party text-center py-12">
          <p className="text-slate-600 text-lg">עדיין אין אירועים.</p>
          <p className="text-slate-500 mt-1">צרי אירוע ראשון ותתחילי לאסוף שירים!</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.id}>
              <Link
                href={`/dashboard/event/${event.id}`}
                className="card-party block hover:shadow-party-lg transition hover:-translate-y-0.5 border-2 border-transparent hover:border-party-pink/20"
              >
                <span className="font-bold text-lg text-slate-800">{event.name}</span>
                <span className="text-party-pink text-sm font-medium mr-2"> • {event._count.participants} משתתפים</span>
                <span className="text-slate-400 text-sm"> • {event.status}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
