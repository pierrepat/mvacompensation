import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { CityFrontmatter } from "@/lib/content-types";
import { getContentSlugs, getContentBySlug } from "@/lib/content";

export default function CiudadesIndex({
  params,
}: {
  params: { locale: Locale };
}) {
  const slugs = getContentSlugs(params.locale, "ciudades");

  const cities = slugs
    .map((slug) => {
      const { meta } = getContentBySlug<CityFrontmatter>(
        params.locale,
        "ciudades",
        slug
      );
      return { slug, meta };
    })
    .sort((a, b) => a.meta.city.localeCompare(b.meta.city));

  // Group by state for a scannable, well-linked hub page.
  const byState: Record<string, typeof cities> = {};
  for (const c of cities) (byState[c.meta.state] ||= []).push(c);
  const states = Object.keys(byState).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-navy-900">
        Abogado de Accidentes por Ciudad
      </h1>
      <p className="mt-4 text-gray-600 max-w-2xl">
        Encuentra un abogado de accidentes de auto que habla español en tu
        ciudad. Conexión gratis, sin compromiso, y no pagas nada hasta que ganes
        tu caso.
      </p>

      {cities.length > 0 ? (
        <div className="mt-10 space-y-10">
          {states.map((state) => (
            <section key={state}>
              <h2 className="text-xl font-semibold text-navy-900 mb-4">
                {state}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {byState[state].map(({ slug, meta }) => (
                  <Link
                    key={slug}
                    href={`/${params.locale}/ciudades/${slug}`}
                    className="group flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:border-navy-200 hover:shadow-sm transition-all"
                  >
                    <span className="font-semibold text-gray-900 group-hover:text-navy-900 transition-colors">
                      {meta.city}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-navy-900 transition-colors" />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-gray-500">Ciudades próximamente.</p>
      )}
    </div>
  );
}
