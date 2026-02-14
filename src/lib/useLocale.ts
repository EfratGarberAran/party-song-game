"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { type Locale, messages, getDir } from "./i18n";

export function useLocale(): { locale: Locale; dir: "rtl" | "ltr"; t: (key: string) => string } {
  const searchParams = useSearchParams();
  const locale = (searchParams.get("lang") === "en" ? "en" : "he") as Locale;
  const dir = getDir(locale);
  const t = useMemo(
    () => (key: string) => messages[locale][key] ?? key,
    [locale]
  );
  return { locale, dir, t };
}
