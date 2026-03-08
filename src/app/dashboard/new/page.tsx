"use client";

import { useState } from "react";
import { PRESET_QUESTIONS } from "@/lib/constants";

const PRESET_KEYS = Object.keys(PRESET_QUESTIONS);

export default function NewEventPage() {
  const [name, setName] = useState("");
  const [question, setQuestion] = useState(PRESET_QUESTIONS.describe_you.he);
  const [customQuestion, setCustomQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const useCustom = !!customQuestion.trim();
  const finalQuestion = useCustom ? customQuestion.trim() : question;

  return (
    <div className="max-w-md">
      <h1 className="text-3xl font-bold mb-2 text-slate-800">אירוע חדש</h1>
      <p className="text-slate-600 mb-6">בחרי שאלה והתחילי לאסוף שירים</p>
      <div className="card-party">
        <form
          action="/api/events"
          method="POST"
          className="flex flex-col gap-4"
          dir="rtl"
          onSubmit={() => setSubmitting(true)}
        >
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-600">שם האירוע</span>
            <input
              type="text"
              name="name"
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
          <input type="hidden" name="question" value={finalQuestion} />
          <button
            type="submit"
            disabled={submitting}
            className="btn-party-primary mt-2"
          >
            {submitting ? "יוצר..." : "צור אירוע"}
          </button>
        </form>
      </div>
    </div>
  );
}
