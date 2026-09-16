import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/lib/i18n";
import { getContentSlugs, getContentBySlug } from "@/lib/content";
import { BASE_URL } from "@/lib/seo";
import {
  SHARED_STATIC_ROUTES,
  LOCALE_ONLY_ROUTES,
  CONTENT_SECTIONS,
} from "@/lib/routes";

// Static (non-content) pages: bump when their copy materially changes.
// Never use `new Date()` here: a lastmod that changes on every build teaches
// Google to ignore it for the whole sitemap.
const STATIC_LAST_MODIFIED = new Date("2026-09-16");

// Lead-capture pages are noindex and must never be advertised in the sitemap.
const NOINDEX_ROUTES = new Set(["/quiz", "/cuestionario"]);

function contentLastModified(locale: Locale, section: string, slug: string) {
  const { meta } = getContentBySlug(locale, section, slug);
  const d = new Date(meta.lastUpdated || meta.publishedAt || STATIC_LAST_MODIFIED);
  return isNaN(d.getTime()) ? STATIC_LAST_MODIFIED : d;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static routes present in both locales, with full hreflang
  for (const locale of locales) {
    for (const route of SHARED_STATIC_ROUTES) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.8,
        alternates: {
          languages: {
            en: `${BASE_URL}/en${route}`,
            es: `${BASE_URL}/es${route}`,
          },
        },
      });
    }
    for (const route of LOCALE_ONLY_ROUTES[locale]) {
      if (NOINDEX_ROUTES.has(route)) continue;
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: { [locale]: `${BASE_URL}/${locale}${route}` } },
      });
    }
  }

  // Content pages: one entry per locale that actually has the slug, hreflang
  // only to the other locale when that locale has the same slug.
  for (const section of CONTENT_SECTIONS) {
    const slugsByLocale: Record<Locale, string[]> = {
      en: getContentSlugs("en", section),
      es: getContentSlugs("es", section),
    };
    for (const locale of locales) {
      const otherLocale: Locale = locale === "en" ? "es" : "en";
      for (const slug of slugsByLocale[locale]) {
        const path = `/${section}/${slug}`;
        const languages: Record<string, string> = {
          [locale]: `${BASE_URL}/${locale}${path}`,
        };
        if (slugsByLocale[otherLocale].includes(slug)) {
          languages[otherLocale] = `${BASE_URL}/${otherLocale}${path}`;
        }
        entries.push({
          url: `${BASE_URL}/${locale}${path}`,
          lastModified: contentLastModified(locale, section, slug),
          changeFrequency: "monthly",
          priority: 0.9,
          alternates: { languages },
        });
      }
    }
  }

  return entries;
}
