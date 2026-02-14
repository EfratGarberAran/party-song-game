"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "party_guesser";
const POLL_INTERVAL = 5000;

type State = {
  status: string;
  currentSongIndex: number;
  totalSongs: number;
  currentSong: {
    trackName: string | null;
    artistName: string | null;
    participantNames: string[];
  } | null;
  playlistUrl: string | null;
};

export function PlayGameClient({
  eventId,
  eventCode,
  status: initialStatus,
}: {
  eventId: string;
  eventCode: string;
  status: string;
}) {
  const [state, setState] = useState<State | null>(null);
  const [guesserName, setGuesserName] = useState("");
  const [chosenName, setChosenName] = useState("");
  const [submittedForSongIndex, setSubmittedForSongIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const name =
      typeof window !== "undefined"
        ? window.localStorage.getItem(`${STORAGE_KEY}_${eventId}`)
        : null;
    if (name) setGuesserName(name);
  }, [eventId]);

  function fetchState() {
    fetch(`/api/events/${eventId}/state`)
      .then((res) => res.ok && res.json())
      .then((data) => data && setState(data))
      .catch(() => {});
  }

  useEffect(() => {
    fetchState();
    const t = setInterval(fetchState, POLL_INTERVAL);
    return () => clearInterval(t);
  }, [eventId]);


  const guessSubmitted =
    state !== null &&
    submittedForSongIndex !== null &&
    state.currentSongIndex === submittedForSongIndex;

  async function submitGuess(e: React.FormEvent) {
    e.preventDefault();
    if (!chosenName || !guesserName) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/guess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guesserName, chosenName }),
      });
      if (res.ok && state !== null) {
        setSubmittedForSongIndex(state.currentSongIndex);
      }
    } finally {
      setLoading(false);
    }
  }

  if (initialStatus === "collecting") {
    return (
      <div className="card-party text-center">
        <p className="text-slate-600">
          המשחק עדיין לא התחיל. המארגן ייצור פלייליסט ויתחיל את המשחק.
        </p>
      </div>
    );
  }

  if (initialStatus === "ended") {
    return (
      <div className="card-party text-center space-y-4">
        <p className="text-lg text-slate-700 font-medium">האירוע הסתיים.</p>
        <button
          type="button"
          onClick={() => router.push(`/event/${eventCode}/leaderboard`)}
          className="btn-party-primary"
        >
          צפה בלוח המוביל
        </button>
      </div>
    );
  }

  if (!state) {
    return <p className="text-slate-500">טוען...</p>;
  }

  if (state.status === "ended") {
    return (
      <div className="card-party text-center space-y-4">
        <p className="text-lg text-slate-700 font-medium">האירוע הסתיים.</p>
        <button
          type="button"
          onClick={() => router.push(`/event/${eventCode}/leaderboard`)}
          className="btn-party-primary"
        >
          צפה בלוח המוביל
        </button>
      </div>
    );
  }

  if (!state.currentSong || state.currentSong.participantNames.length === 0) {
    return (
      <div className="card-party text-center">
        <p className="text-slate-600">מחכים לשיר הבא... רענן/י בעוד רגע.</p>
      </div>
    );
  }

  if (guessSubmitted) {
    return (
      <div className="card-party text-center">
        <p className="text-party-pink font-bold">הניחוש נשמר. מחכים לשיר הבא...</p>
      </div>
    );
  }

  return (
    <div className="card-party space-y-6">
      <div>
        <p className="text-party-pink text-sm font-medium">
          שיר {state.currentSongIndex + 1} מתוך {state.totalSongs}
        </p>
        <p className="text-xl font-bold text-slate-800 mt-1">
          {state.currentSong.trackName || "שיר"}
          {state.currentSong.artistName && (
            <span className="text-slate-600 font-normal"> – {state.currentSong.artistName}</span>
          )}
        </p>
      </div>
      <form onSubmit={submitGuess} className="space-y-4">
        <p className="font-bold text-slate-800">מי בחר את השיר הזה?</p>
        {!guesserName && (
          <label className="flex flex-col gap-1">
            <span className="text-sm text-slate-600">השם שלך (לזיהוי הניחוש)</span>
            <input
              type="text"
              value={guesserName}
              onChange={(e) => setGuesserName(e.target.value)}
              required
              className="input-party"
            />
          </label>
        )}
        <div className="flex flex-col gap-2">
          {state.currentSong.participantNames.map((n) => (
            <label
              key={n}
              className={`flex items-center gap-3 cursor-pointer rounded-2xl border-2 p-3 transition ${
                chosenName === n
                  ? "border-party-pink bg-party-rose/30"
                  : "border-party-rose/20 hover:border-party-pink/40"
              }`}
            >
              <input
                type="radio"
                name="chosen"
                value={n}
                checked={chosenName === n}
                onChange={() => setChosenName(n)}
                className="w-4 h-4 text-party-pink"
              />
              <span className="font-medium">{n}</span>
            </label>
          ))}
        </div>
        <button
          type="submit"
          disabled={loading || !chosenName}
          className="btn-party-primary w-full disabled:opacity-50"
        >
          {loading ? "שולח..." : "שלח ניחוש"}
        </button>
      </form>
    </div>
  );
}
