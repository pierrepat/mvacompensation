import { locales } from "./i18n";
import { getContentSlugs } from "./content";
import {
  SHARED_STATIC_ROUTES,
  LOCALE_ONLY_ROUTES,
  CONTENT_SECTIONS,
} from "./route-map";

export * from "./route-map";

/**
 * Every real path on the site, for both locales. Server-only (reads the
 * content directory). Used by the sitemap and to give the language switcher a
 * list of real targets so it never links to a page that does not exist.
 */
export function getAllPaths(): string[] {
  const paths: string[] = [];
  for (const locale of locales) {
    for (const r of SHARED_STATIC_ROUTES) paths.push(`/${locale}${r}`);
    for (const r of LOCALE_ONLY_ROUTES[locale]) paths.push(`/${locale}${r}`);
    for (const section of CONTENT_SECTIONS) {
      for (const slug of getContentSlugs(locale, section)) {
        paths.push(`/${locale}/${section}/${slug}`);
      }
    }
  }
  return paths;
}
