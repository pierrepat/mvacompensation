import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/lib/i18n";
import { getContentSlugs } from "@/lib/content";

const baseUrl = "https://mvacompensation.com";

/** Only include hreflang alternate if the slug exists in the other locale */
function buildAlternates(
  locale: Locale,
  path: string,
  otherLocaleSlugs?: Set<string>,
  slug?: string
) {
  const otherLocale = locale === "en" ? "es" : "en";
  const languages: Record<string, string> = {
    [locale]: `${baseUrl}/${locale}${path}`,
  };

  // If no slug check needed (static routes), always include both
  if (!otherLocaleSlugs || !slug) {
    languages[otherLocale] = `${baseUrl}/${otherLocale}${path}`;
  } else if (otherLocaleSlugs.has(slug)) {
    languages[otherLocale] = `${baseUrl}/${otherLocale}${path}`;
  }

  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Canonical static routes per locale — no duplicates
  const staticRoutesPerLocale: Record<Locale, string[]> = {
    // NOTE: /quiz and /cuestionario are intentionally excluded — they're
    // noindex lead-capture pages, so they must not be advertised in the sitemap.
    en: [
      "",
      "/estados",
      "/lesiones",
      "/guias",
      "/calculator/settlement-estimator",
      "/about",
      "/privacy",
      "/terms",
    ],
    es: [
      "",
      "/estados",
      "/lesiones",
      "/guias",
      "/calculadora",
      "/about",
      "/privacy",
      "/terms",
    ],
  };

  // Map EN static routes to ES equivalents for hreflang
  const staticRouteMap: Record<string, string> = {
    "": "",
    "/estados": "/estados",
    "/lesiones": "/lesiones",
    "/guias": "/guias",
    "/calculator/settlement-estimator": "/calculadora",
    "/calculadora": "/calculator/settlement-estimator",
    "/about": "/about",
    "/privacy": "/privacy",
    "/terms": "/terms",
  };

  const entries: MetadataRoute.Sitemap = [];

  // Static routes — one entry per locale, correct hreflang
  for (const locale of locales) {
    for (const route of staticRoutesPerLocale[locale as Locale]) {
      const otherLocale = locale === "en" ? "es" : "en";
      const otherRoute = staticRouteMap[route] ?? route;

      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.8,
        alternates: {
          languages: {
            [locale]: `${baseUrl}/${locale}${route}`,
            [otherLocale]: `${baseUrl}/${otherLocale}${otherRoute}`,
          },
        },
      });
    }
  }

  // Pre-compute slug sets for cross-locale hreflang validation
  const sections = ["estados", "lesiones", "guias"] as const;
  const slugsByLocale: Record<string, Record<Locale, Set<string>>> = {};

  for (const section of sections) {
    slugsByLocale[section] = {
      en: new Set(getContentSlugs("en", section)),
      es: new Set(getContentSlugs("es", section)),
    };
  }

  // Dynamic content pages — deduplicated, only valid hreflang
  const seen = new Set<string>();

  for (const section of sections) {
    for (const locale of locales) {
      const loc = locale as Locale;
      const otherLocale = loc === "en" ? "es" : "en";
      const slugs = getContentSlugs(loc, section);

      for (const slug of slugs) {
        const key = `${section}/${slug}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const path = `/${section}/${slug}`;
        const otherHasSameSlug = slugsByLocale[section][otherLocale].has(slug);

        // Always add the current locale's entry
        entries.push({
          url: `${baseUrl}/${loc}${path}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.9,
          alternates: buildAlternates(
            loc,
            path,
            slugsByLocale[section][otherLocale],
            slug
          ),
        });

        // Add the other locale's entry if it exists (and wasn't already added)
        if (otherHasSameSlug) {
          entries.push({
            url: `${baseUrl}/${otherLocale}${path}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.9,
            alternates: buildAlternates(
              otherLocale,
              path,
              slugsByLocale[section][loc],
              slug
            ),
          });
        }
      }
    }
  }

  return entries;
}
