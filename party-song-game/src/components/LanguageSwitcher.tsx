"use client";

import { useRouter, usePathname } from "next/navigation";

type Locale = "he" | "en";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const next = locale === "he" ? "en" : "he";
  return (
    <button
      type="button"
      onClick={() => {
        const url = new URL(pathname, window.location.origin);
        url.searchParams.set("lang", next);
        router.push(url.pathname + url.search);
        router.refresh();
      }}
      className="text-sm text-slate-500 hover:text-slate-700 underline"
    >
      {next === "he" ? "עברית" : "English"}
    </button>
  );
}
