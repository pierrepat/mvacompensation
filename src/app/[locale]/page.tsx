import fs from "fs";
import path from "path";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { quizUrl } from "@/lib/quiz-url";
import { getDictionary } from "@/lib/dictionaries";
import { LegalServiceJsonLd } from "@/components/JsonLd";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { renderMDX } from "@/lib/mdx";
import { AuthorBio } from "@/components/AuthorBio";
import matter from "gray-matter";

export default async function HomePage({
  params,
}: {
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);

  // Try to load locale-specific home MDX content
  const homePath = path.join(
    process.cwd(),
    "content",
    params.locale,
    "home.mdx"
  );
  const hasHomeContent = fs.existsSync(homePath);

  let mdxContent: React.ReactNode = null;
  let homeMeta: { author?: { name: string; credential?: string }; reviewer?: { name: string; credential: string }; publishedAt?: string; lastUpdated?: string } = {};

  if (hasHomeContent) {
    const raw = fs.readFileSync(homePath, "utf-8");
    const { data, content } = matter(raw);
    homeMeta = data as typeof homeMeta;
    mdxContent = await renderMDX(content);
  }

  return (
    <>
      <LegalServiceJsonLd locale={params.locale} />

      {/* Hero */}
      <section className="bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl mx-auto">
            {dict.home.h1}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-navy-100 max-w-2xl mx-auto">
            {dict.home.subtitle}
          </p>
          <div className="mt-10">
            <Link
              href={quizUrl(params.locale, { source: "home" })}
              className="inline-block bg-white text-navy-900 font-semibold px-8 py-3 rounded-md hover:bg-navy-50 transition-colors text-base sm:text-lg"
            >
              {dict.cta.freeEvaluation}
            </Link>
          </div>
        </div>
      </section>

      {/* MDX body content (if exists) or fallback cards */}
      {mdxContent ? (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {homeMeta.author && (
            <AuthorBio
              locale={params.locale}
              author={homeMeta.author}
              reviewer={homeMeta.reviewer}
              publishedAt={homeMeta.publishedAt || "2026-05-01"}
              lastUpdated={homeMeta.lastUpdated || "2026-05-06"}
            />
          )}
          <LeadCaptureForm locale={params.locale} variant="banner" />
          <div className="prose prose-navy prose-lg max-w-none">
            {mdxContent}
          </div>
          <LeadCaptureForm locale={params.locale} variant="banner" />
        </section>
      ) : (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid gap-8 sm:grid-cols-2">
            <SectionCard
              href={`/${params.locale}/states`}
              title={dict.home.sectionStates}
              description={dict.home.sectionStatesDesc}
              cta={dict.cta.learnMore}
            />
            <SectionCard
              href={`/${params.locale}/injuries`}
              title={dict.home.sectionInjuries}
              description={dict.home.sectionInjuriesDesc}
              cta={dict.cta.learnMore}
            />
            <SectionCard
              href={`/${params.locale}/calculator/settlement-estimator`}
              title={dict.home.sectionCalculator}
              description={dict.home.sectionCalculatorDesc}
              cta={dict.cta.getStarted}
            />
            <SectionCard
              href={`/${params.locale}/guides`}
              title={dict.home.sectionGuides}
              description={dict.home.sectionGuidesDesc}
              cta={dict.cta.learnMore}
            />
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {dict.cta.freeEvaluation}
          </h2>
          <p className="mt-4 text-gray-600">
            {dict.home.subtitle}
          </p>
          <div className="mt-8">
            <Link
              href={quizUrl(params.locale, { source: "home" })}
              className="inline-block bg-navy-900 text-white font-semibold px-8 py-3 rounded-md hover:bg-navy-700 transition-colors"
            >
              {dict.cta.getStarted}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionCard({
  href,
  title,
  description,
  cta,
}: {
  href: string;
  title: string;
  description: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-lg border border-gray-200 p-6 hover:border-navy-200 hover:shadow-sm transition-all"
    >
      <h2 className="text-xl font-semibold text-gray-900 group-hover:text-navy-900 transition-colors">
        {title}
      </h2>
      <p className="mt-2 text-gray-600 text-sm leading-relaxed">
        {description}
      </p>
      <span className="mt-4 inline-block text-sm font-medium text-navy-900">
        {cta} &rarr;
      </span>
    </Link>
  );
}
