import type { Locale } from "./i18n";

/**
 * Build the correct quiz URL based on locale and optional source params.
 */
export function quizUrl(
  locale: Locale,
  params?: { source?: string; state?: string }
): string {
  const base = locale === "es" ? `/${locale}/cuestionario` : `/${locale}/quiz`;
  const sp = new URLSearchParams();
  if (params?.source) sp.set("source", params.source);
  if (params?.state) sp.set("state", params.state);
  const qs = sp.toString();
  return qs ? `${base}?${qs}` : base;
}
