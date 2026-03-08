import Link from "next/link";
import { Suspense } from "react";
import { LocaleSwitcher } from "@/components/LocaleProvider";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-6 right-6 z-10">
        <Suspense fallback={null}>
          <LocaleSwitcher />
        </Suspense>
      </div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-party-gold/20 rounded-full blur-3xl" aria-hidden />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-party-pink/20 rounded-full blur-3xl" aria-hidden />
      <div className="relative z-10 text-center max-w-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-l from-party-pink to-party-violet bg-clip-text text-transparent" dir="ltr">
          Party Shuffle
        </h1>
        <p className="text-slate-600 text-lg mb-10 max-w-md mx-auto" dir="ltr">
          Everyone picks a song. Guess who picked what.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/login" className="btn-party-secondary w-full sm:w-auto text-center">
            התחברות
          </Link>
          <Link href="/signup" className="btn-party-primary w-full sm:w-auto text-center">
            הרשמה
          </Link>
        </div>
      </div>
    </main>
  );
}
