import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { StateFrontmatter } from "@/lib/content-types";
import { getContentSlugs, getContentBySlug } from "@/lib/content";

export default function EstadosIndex({
  params,
}: {
  params: { locale: Locale };
}) {
  const isEn = params.locale === "en";
  const slugs = getContentSlugs(params.locale, "estados");

  const states = slugs.map((slug) => {
    const { meta } = getContentBySlug<StateFrontmatter>(
      params.locale,
      "estados",
      slug
    );
    return { slug, meta };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-navy-900">
        {isEn
          ? "Motor Vehicle Accident Compensation by State"
          : "Compensación por Accidente de Auto por Estado"}
      </h1>
      <p className="mt-4 text-gray-600 max-w-2xl">
        {isEn
          ? "Laws vary significantly by state. Select your state to learn about statutes of limitations, insurance requirements, and average settlement values."
          : "Las leyes varían significativamente según el estado. Selecciona tu estado para conocer los estatutos de limitaciones, requisitos de seguro y montos promedio de compensación."}
      </p>

      {states.length > 0 ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {states.map(({ slug, meta }) => (
            <Link
              key={slug}
              href={`/${params.locale}/estados/${slug}`}
              className="group flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:border-navy-200 hover:shadow-sm transition-all"
            >
              <div>
                <span className="font-semibold text-gray-900 group-hover:text-navy-900 transition-colors">
                  {meta.stateCode}
                </span>
                <span className="ml-2 text-sm text-gray-600">
                  {meta.title.split("|")[0].split("en ").pop()?.trim()}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-navy-900 transition-colors" />
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-gray-500">
          {isEn ? "State guides coming soon." : "Guías estatales próximamente."}
        </p>
      )}
    </div>
  );
}
