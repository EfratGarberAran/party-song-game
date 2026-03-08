"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PRESET_QUESTIONS } from "@/lib/constants";
import { createEventAction } from "./actions";

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
      const formData = new FormData();
      formData.set("name", name.trim());
      formData.set("question", finalQuestion);
      const result = await createEventAction(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      if (result?.eventId) {
        router.push(`/dashboard/event/${result.eventId}`);
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
          {error && <p className="text-party-coral text-sm font-medium">{error}</p>}
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
