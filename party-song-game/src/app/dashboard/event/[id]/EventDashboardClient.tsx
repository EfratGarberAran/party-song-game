"use client";

import { useState } from "react";
import { SpotifySetupCard } from "@/components/SpotifySetupCard";

type Props = {
  eventId: string;
  status: string;
  hasSpotifyToken: boolean;
  participantsCount: number;
  playlistUrl: string | null;
  currentSongIndex: number;
  totalSongs: number;
};

export function EventDashboardClient({
  eventId,
  status,
  hasSpotifyToken,
  participantsCount,
  playlistUrl,
  currentSongIndex,
  totalSongs,
}: Props) {
  const [creating, setCreating] = useState(false);
  const [spotifyError, setSpotifyError] = useState("");

  function connectSpotify() {
    const port = typeof window !== "undefined" ? window.location.port || "3000" : "3000";
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      window.location.href = `http://127.0.0.1:${port}/api/spotify/auth`;
      return;
    }
    window.location.href = "/api/spotify/auth";
  }

  async function reconnectSpotify() {
    setSpotifyError("");
    try {
      await fetch("/api/spotify/disconnect", { method: "POST", credentials: "include" });
      connectSpotify();
    } catch {
      setSpotifyError("לא הצלחנו להתנתק. נסי לרענן את הדף.");
    }
  }

  async function createPlaylist() {
    setCreating(true);
    setSpotifyError("");
    try {
      const res = await fetch(`/api/events/${eventId}/create-playlist`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        let msg = "שגיאה ביצירת הפלייליסט";
        try {
          const data = await res.json();
          if (data?.error) msg = data.error;
        } catch {
          msg = res.status === 500 ? "שגיאה בשרת. נסי שוב." : `שגיאה ${res.status}`;
        }
        setSpotifyError(msg);
        return;
      }
      window.location.reload();
    } finally {
      setCreating(false);
    }
  }

  async function nextSong() {
    await fetch(`/api/events/${eventId}/next-song`, { method: "POST", credentials: "include" });
    window.location.reload();
  }

  async function endEvent() {
    await fetch(`/api/events/${eventId}/end`, { method: "POST", credentials: "include" });
    window.location.reload();
  }

  if (status === "collecting") {
    return (
      <section className="space-y-4">
        {!hasSpotifyToken && <SpotifySetupCard />}
        <div className="card-party space-y-3">
        {!hasSpotifyToken ? (
          <button
            type="button"
            onClick={connectSpotify}
            className="btn-party-primary"
          >
            התחבר לספוטיפיי
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={createPlaylist}
              disabled={participantsCount === 0 || creating}
              className="btn-party-primary disabled:opacity-50"
            >
              {creating ? "יוצר..." : "צור פלייליסט בספוטיפיי"}
            </button>
            {spotifyError && <p className="text-party-coral text-sm font-medium">{spotifyError}</p>}
            <p className="text-slate-500 text-sm">
              קיבלת Forbidden?{" "}
              <button
                type="button"
                onClick={reconnectSpotify}
                className="underline font-medium text-party-violet hover:text-party-pink"
              >
                התחברי מחדש לספוטיפיי
              </button>
            </p>
          </>
        )}
        </div>
      </section>
    );
  }

  if (status === "playing") {
    return (
      <section className="card-party space-y-4">
        <div className="rounded-2xl bg-party-rose/20 border-2 border-party-pink/30 p-4 text-slate-700 text-sm">
          <p className="font-bold mb-2">איך זה עובד?</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>פתחי את הפלייליסט בספוטיפיי והפעילי ניגון.</li>
            <li>בכל פעם ששיר חדש מתחיל (או שעברת לשיר הבא) – לחצי כאן על &quot;שיר חדש התחיל&quot;. המשתתפים יראו אז את שאלת הניחוש ויוכלו להצביע.</li>
            <li>בסיום – לחצי &quot;סיום אירוע&quot;.</li>
          </ol>
        </div>
        {playlistUrl && (
          <a
            href={playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-party-primary inline-block text-center"
          >
            פתח פלייליסט בספוטיפיי
          </a>
        )}
        <p className="text-slate-600 font-medium">
          שיר {currentSongIndex + 1} מתוך {totalSongs}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={nextSong}
            className="rounded-2xl bg-party-violet px-5 py-2.5 font-bold text-white shadow-party hover:opacity-90 hover:-translate-y-0.5 transition"
          >
            שיר חדש התחיל
          </button>
          <button
            type="button"
            onClick={endEvent}
            className="rounded-2xl border-2 border-party-coral/50 bg-white px-5 py-2.5 font-bold text-party-coral hover:bg-party-rose/30 transition"
          >
            סיום אירוע
          </button>
        </div>
      </section>
    );
  }

  return null;
}
