"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      // Full page navigation so the session cookie is definitely sent on the next request
      window.location.href = "/dashboard";
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6" dir="rtl">
      <div className="card-party w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-party-pink">התחברות</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <p className="text-party-coral text-sm font-medium">{error}</p>
          )}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-600">אימייל</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-party"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-600">סיסמה</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-party"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="btn-party-primary mt-2"
          >
            {loading ? "מתחבר..." : "התחבר"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          אין לך חשבון?{" "}
          <Link href="/signup" className="font-bold text-party-pink hover:text-party-coral">
            הירשם
          </Link>
        </p>
      </div>
    </main>
  );
}
