"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const targetLocale = locale === "en" ? "es" : "en";

  // Replace the locale segment in the current path
  const targetPath = pathname.replace(`/${locale}`, `/${targetLocale}`);

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
