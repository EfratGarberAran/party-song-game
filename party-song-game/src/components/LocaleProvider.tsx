"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

export function LocaleSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isEn = searchParams.get("lang") === "en";
  const newLang = isEn ? "he" : "en";
  const label = isEn ? "עברית" : "English";
  const params = new URLSearchParams(searchParams.toString());
  params.set("lang", newLang);
  const href = pathname + (params.toString() ? "?" + params.toString() : "");
  return (
    <Link href={href} className="text-sm font-medium text-party-pink hover:text-party-coral transition">
      {label}
    </Link>
  );
}
