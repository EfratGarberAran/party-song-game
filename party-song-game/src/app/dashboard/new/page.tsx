"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PRESET_QUESTIONS } from "@/lib/constants";

const PRESET_KEYS = Object.keys(PRESET_QUESTIONS);

export default function NewEventPage() {
  const [name, setName] = useState("");
  const [question, setQuestion] = useState(PRESET_QUESTIONS.describe_you.he);
  const [customQuestion, setCustomQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const useCustom = !!customQuestion.trim();
  const finalQuestion = useCustom ? customQuestion.trim() : question;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          question: finalQuestion,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          setError("ההתחברות פגה. היכנסי מחדש לדף ההתחברות.");
          return;
        }
        setError(data.error || "אירעה שגיאה");
        return;
      }
      if (data?.id) {
        router.push(`/dashboard/event/${data.id}`);
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-3xl font-bold mb-2 text-slate-800">אירוע חדש</h1>
      <p className="text-slate-600 mb-6">בחרי שאלה והתחילי לאסוף שירים</p>
      <div className="card-party">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" dir="rtl">
          {error && (
            <div className="flex flex-col gap-1">
              <p className="text-party-coral text-sm font-medium">{error}</p>
              {error.includes("ההתחברות פגה") && (
                <Link
                  href="/login?returnTo=/dashboard/new"
                  className="text-sm font-bold text-party-pink hover:text-party-coral"
                >
                  מעבר להתחברות →
                </Link>
              )}
            </div>
          )}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-600">שם האירוע</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-party"
              placeholder="למשל: מסיבת יום הולדת"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-600">שאלה מוכנה</span>
            <select
              value={customQuestion ? "" : question}
              onChange={(e) => {
                const v = e.target.value;
                if (PRESET_KEYS.includes(v)) {
                  setQuestion(PRESET_QUESTIONS[v as keyof typeof PRESET_QUESTIONS].he);
                  setCustomQuestion("");
                }
              }}
              className="input-party"
            >
              {PRESET_KEYS.map((key) => (
                <option key={key} value={PRESET_QUESTIONS[key].he}>
                  {PRESET_QUESTIONS[key].he}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-600">או שאלה מותאמת</span>
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              className="input-party"
              placeholder="הזיני שאלה משלך..."
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="btn-party-primary mt-2"
          >
            {loading ? "יוצר..." : "צור אירוע"}
          </button>
        </form>
      </div>
    </div>
  );
}
