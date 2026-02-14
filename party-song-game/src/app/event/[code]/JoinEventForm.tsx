"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "party_guesser";

export function JoinEventForm({
  eventId,
  eventCode,
}: {
  eventId: string;
  eventCode: string;
}) {
  const [name, setName] = useState("");
  const [spotifyLink, setSpotifyLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), spotifyLink: spotifyLink.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "שגיאה");
        return;
      }
      if (typeof window !== "undefined") {
        window.localStorage.setItem(`${STORAGE_KEY}_${eventId}`, name.trim());
      }
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    const playUrl = typeof window !== "undefined" ? `${window.location.origin}/event/${eventCode}/play` : "";
    return (
      <div className="w-full text-center space-y-5">
        <p className="text-lg text-party-pink font-bold">
          תודה! הבחירה נשמרה.
        </p>
        <p className="text-slate-600 text-sm">
          כדי <strong>להצביע</strong> (לנחש מי בחר כל שיר) – פתחי את דף המשחק. בכל שיר תראי את רשימת השמות ותבחרי מי לדעתך בחר את השיר.
        </p>
        <button
          type="button"
          onClick={() => router.push(`/event/${eventCode}/play`)}
          className="btn-party-primary w-full"
        >
          מעבר לדף ההצבעה (משחק)
        </button>
        {playUrl && (
          <p className="text-xs text-slate-500">
            או שמרי את הקישור להצבעה:{" "}
            <a href={playUrl} className="text-party-pink underline break-all">{playUrl}</a>
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      {error && <p className="text-party-coral text-sm font-medium">{error}</p>}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-600">השם שלך</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input-party"
          placeholder="השם שלך"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-600">לינק לשיר בספוטיפיי</span>
        <input
          type="url"
          value={spotifyLink}
          onChange={(e) => setSpotifyLink(e.target.value)}
          required
          className="input-party"
          placeholder="https://open.spotify.com/track/..."
        />
        <span className="text-xs text-slate-400">
          העתיקי לינק לשיר מהאפליקציה או האתר של ספוטיפיי
        </span>
      </label>
      <button type="submit" disabled={loading} className="btn-party-primary mt-1">
        {loading ? "שולח..." : "שלח"}
      </button>
    </form>
  );
}
