import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { InjuryFrontmatter } from "@/lib/content-types";
import { getContentSlugs, getContentBySlug } from "@/lib/content";

export default function LesionesIndex({
  params,
}: {
  params: { locale: Locale };
}) {
  const isEn = params.locale === "en";
  const slugs = getContentSlugs(params.locale, "lesiones");

  const injuries = slugs.map((slug) => {
    const { meta } = getContentBySlug<InjuryFrontmatter>(params.locale, "lesiones", slug);
    return { slug, meta };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-navy-900">
        {isEn ? "Car Accident Injury Guides" : "Guías de Lesiones por Accidente de Auto"}
      </h1>
      <p className="mt-4 text-gray-600 max-w-2xl">
        {isEn
          ? "The type and severity of your injury directly affects the value of your case. Find your injury below."
          : "El tipo y la gravedad de tu lesión afectan directamente el valor de tu caso. Encuentra tu lesión abajo."}
      </p>

      {injuries.length > 0 ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {injuries.map(({ slug, meta }) => (
            <Link
              key={slug}
              href={`/${params.locale}/lesiones/${slug}`}
              className="group flex items-center justify-between rounded-xl border border-gray-200 p-5 hover:border-navy-200 hover:shadow-md transition-all"
            >
              <div>
                <span className="font-semibold text-gray-900 group-hover:text-navy-900 transition-colors">
                  {meta.title.split("|")[0].trim()}
                </span>
                <p className="text-sm text-gray-500 mt-1">{meta.description.slice(0, 80)}...</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-navy-900 transition-colors shrink-0 ml-4" />
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-gray-500">
          {isEn ? "Injury guides coming soon." : "Guías de lesiones próximamente."}
        </p>
      )}
    </div>
  );
}
