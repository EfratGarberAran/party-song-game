"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type User = { id: string; email: string };

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "unauthorized">("loading");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/me", { credentials: "include" })
      .then((res) => {
        if (cancelled) return;
        if (res.status === 401) {
          setStatus("unauthorized");
          return;
        }
        if (!res.ok) return;
        return res.json();
      })
      .then((data) => {
        if (cancelled || !data) return;
        setUser(data);
        setStatus("ok");
      })
      .catch(() => {
        if (!cancelled) setStatus("unauthorized");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (status !== "unauthorized") return;
    window.location.href = "/login";
  }, [status]);

  if (status === "loading" || status === "unauthorized") {
    return (
      <div className="min-h-screen bg-party-mesh flex items-center justify-center" dir="rtl">
        <p className="text-slate-600">טוען...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-party-mesh" dir="rtl">
      <header className="border-b border-party-rose/30 bg-white/80 backdrop-blur-sm px-4 py-4 flex justify-between items-center shadow-party">
        <nav className="flex gap-6 items-center">
          <Link href="/dashboard" className="font-bold text-slate-800 hover:text-party-pink transition">
            האירועים שלי
          </Link>
          <Link href="/dashboard/new" className="font-medium text-party-pink hover:text-party-coral transition">
            אירוע חדש
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {user && <span className="text-sm text-slate-500 hidden sm:inline">{user.email}</span>}
          <Link href="/api/auth/logout" className="text-sm font-medium text-slate-500 hover:text-party-coral transition">
            יציאה
          </Link>
        </div>
      </header>
      <main className="p-6 max-w-4xl mx-auto">{children}</main>
    </div>
  );
}
