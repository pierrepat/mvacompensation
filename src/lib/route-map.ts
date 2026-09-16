// Pure constants shared by server code (sitemap, routes) and client code
// (LanguageSwitcher). No fs imports here.

/** Static routes that exist in both locales at the same path. */
export const SHARED_STATIC_ROUTES = [
  "",
  "/estados",
  "/lesiones",
  "/guias",
  "/calculadora",
  "/recursos",
  "/about",
  "/privacy",
  "/terms",
] as const;

/** Static routes that exist in one locale only. */
export const LOCALE_ONLY_ROUTES: Record<"en" | "es", string[]> = {
  en: ["/quiz"],
  es: ["/ciudades", "/cuestionario"],
};

/** Routes whose path differs between locales (used by the language switcher). */
export const CROSS_LOCALE_MAP: Record<string, string> = {
  "/en/quiz": "/es/cuestionario",
  "/es/cuestionario": "/en/quiz",
};

export const CONTENT_SECTIONS = ["estados", "lesiones", "guias", "ciudades"] as const;
