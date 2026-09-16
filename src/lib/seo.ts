import type { Metadata } from "next";
import type { Locale } from "./i18n";

export const BASE_URL = "https://mvacompensation.com";

/**
 * Self-canonical + hreflang for a page that exists at the same path in both
 * locales (or only in `es` when `esOnly` is set). Every page must set its own
 * canonical: the locale layout intentionally sets none, because a layout-level
 * canonical is inherited by every page that forgets to override it and tells
 * Google "this page is a duplicate of the homepage".
 */
export function pageAlternates(
  locale: Locale,
  path: string,
  opts: { esOnly?: boolean; xDefault?: Locale } = {}
): NonNullable<Metadata["alternates"]> {
  const url = `${BASE_URL}/${locale}${path}`;
  if (opts.esOnly) {
    return { canonical: url, languages: { es: `${BASE_URL}/es${path}` } };
  }
  const xDefault = opts.xDefault ?? "en";
  return {
    canonical: url,
    languages: {
      en: `${BASE_URL}/en${path}`,
      es: `${BASE_URL}/es${path}`,
      "x-default": `${BASE_URL}/${xDefault}${path}`,
    },
  };
}
