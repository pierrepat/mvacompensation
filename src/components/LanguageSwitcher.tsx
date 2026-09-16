"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { CROSS_LOCALE_MAP } from "@/lib/route-map";

/**
 * Links to the same page in the other locale. Only links to pages that really
 * exist: a blind locale swap used to create hundreds of 404 links (Spanish-only
 * states, cities and guides under /en/...), which Google crawled and reported.
 * Falls back to the section hub, then the locale homepage.
 */
export function LanguageSwitcher({
  locale,
  validPaths,
}: {
  locale: Locale;
  validPaths: string[];
}) {
  const pathname = usePathname() || `/${locale}`;
  const targetLocale: Locale = locale === "en" ? "es" : "en";
  const valid = new Set(validPaths);

  const swapped = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${targetLocale}`);
  const sectionHub = swapped.split("/").slice(0, 3).join("/");

  const targetPath =
    CROSS_LOCALE_MAP[pathname] ??
    (valid.has(swapped)
      ? swapped
      : valid.has(sectionHub)
        ? sectionHub
        : `/${targetLocale}`);

  return (
    <Link
      href={targetPath}
      className="text-sm font-medium text-gray-500 hover:text-navy-900 transition-colors"
      hrefLang={targetLocale}
    >
      {targetLocale === "es" ? "ES" : "EN"}
    </Link>
  );
}
