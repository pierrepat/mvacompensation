import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/lib/i18n";
import { getContentSlugs } from "@/lib/content";

const baseUrl = "https://mvacompensation.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/estados",
    "/states",
    "/lesiones",
    "/injuries",
    "/guias",
    "/calculadora",
    "/guides",
    "/calculator/settlement-estimator",
    "/about",
    "/privacy",
    "/terms",
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Static routes
  for (const locale of locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en${route}`,
            es: `${baseUrl}/es${route}`,
          },
        },
      });
    }
  }

  // Dynamic state pages
  for (const locale of locales) {
    const slugs = getContentSlugs(locale as Locale, "estados");
    for (const slug of slugs) {
      entries.push({
        url: `${baseUrl}/${locale}/estados/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.9,
        alternates: {
          languages: {
            en: `${baseUrl}/en/estados/${slug}`,
            es: `${baseUrl}/es/estados/${slug}`,
          },
        },
      });
    }
  }

  // Dynamic injury pages
  for (const locale of locales) {
    const slugs = getContentSlugs(locale as Locale, "lesiones");
    for (const slug of slugs) {
      entries.push({
        url: `${baseUrl}/${locale}/lesiones/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.9,
        alternates: {
          languages: {
            en: `${baseUrl}/en/lesiones/${slug}`,
            es: `${baseUrl}/es/lesiones/${slug}`,
          },
        },
      });
    }
  }

  // Dynamic guide pages
  for (const locale of locales) {
    const slugs = getContentSlugs(locale as Locale, "guias");
    for (const slug of slugs) {
      entries.push({
        url: `${baseUrl}/${locale}/guias/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.9,
        alternates: {
          languages: {
            en: `${baseUrl}/en/guias/${slug}`,
            es: `${baseUrl}/es/guias/${slug}`,
          },
        },
      });
    }
  }

  return entries;
}
