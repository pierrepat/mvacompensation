import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { GuideFrontmatter } from "@/lib/content-types";
import { getContentSlugs, getContentBySlug } from "@/lib/content";

export default function GuiasIndex({ params }: { params: { locale: Locale } }) {
  const isEn = params.locale === "en";
  const slugs = getContentSlugs(params.locale, "guias");
  const guides = slugs.map((slug) => {
    const { meta } = getContentBySlug<GuideFrontmatter>(params.locale, "guias", slug);
    return { slug, meta };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-navy-900">
        {isEn ? "Guides & Resources" : "Guías y Recursos"}
      </h1>
      <p className="mt-4 text-gray-600 max-w-2xl">
        {isEn
          ? "Step-by-step guides to help you navigate the accident claims process."
          : "Guías paso a paso para ayudarte a navegar el proceso de reclamos por accidente."}
      </p>
      {guides.length > 0 ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {guides.map(({ slug, meta }) => (
            <Link key={slug} href={`/${params.locale}/guias/${slug}`} className="group flex items-center justify-between rounded-xl border border-gray-200 p-5 hover:border-navy-200 hover:shadow-md transition-all">
              <div>
                <span className="font-semibold text-gray-900 group-hover:text-navy-900 transition-colors">{meta.title.split("|")[0].trim()}</span>
                <p className="text-sm text-gray-500 mt-1">{meta.description.slice(0, 80)}...</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-navy-900 transition-colors shrink-0 ml-4" />
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-gray-500">{isEn ? "Guides coming soon." : "Guías próximamente."}</p>
      )}
    </div>
  );
}
