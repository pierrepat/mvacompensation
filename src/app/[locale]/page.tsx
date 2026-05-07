import fs from "fs";
import path from "path";
import Link from "next/link";
import { ArrowRight, Shield, Clock, Phone, CheckCircle, Users, Scale, DollarSign, Globe, MessageCircle } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { quizUrl } from "@/lib/quiz-url";
import { LegalServiceJsonLd } from "@/components/JsonLd";
import { renderMDX } from "@/lib/mdx";
import matter from "gray-matter";

export default async function HomePage({
  params,
}: {
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);
  const isEs = params.locale === "es";

  // Load home MDX content if it exists
  const homePath = path.join(process.cwd(), "content", params.locale, "home.mdx");
  const hasContent = fs.existsSync(homePath);
  let mdxContent: React.ReactNode = null;
  if (hasContent) {
    const raw = fs.readFileSync(homePath, "utf-8");
    const { content } = matter(raw);
    mdxContent = await renderMDX(content);
  }

  const states = [
    { name: "Florida", slug: "florida", code: "FL" },
    { name: "Texas", slug: "texas", code: "TX" },
    { name: "California", slug: "california", code: "CA" },
    { name: isEs ? "Nueva York" : "New York", slug: "nueva-york", code: "NY" },
    { name: "Arizona", slug: "arizona", code: "AZ" },
  ];

  return (
    <>
      <LegalServiceJsonLd locale={params.locale} />

      {/* ─── HERO ─── */}
      <section className="relative bg-navy-950 overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-navy-700/20 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl">
            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { icon: Shield, text: dict.home.trust1 },
                { icon: Phone, text: dict.home.trust2 },
                { icon: Clock, text: dict.home.trust3 },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="inline-flex items-center gap-1.5 bg-white/10 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Icon className="w-3.5 h-3.5" />
                  {text}
                </span>
              ))}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              {dict.home.h1}
              {dict.home.h1_accent && (
                <span className="block mt-2 bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
                  {dict.home.h1_accent}
                </span>
              )}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl leading-relaxed">
              {dict.home.subtitle}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href={quizUrl(params.locale, { source: "home_hero" })}
                className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-navy-950 font-bold px-8 py-4 rounded-xl transition-colors text-lg shadow-lg shadow-amber-400/20"
              >
                {dict.cta.freeEvaluation}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href={`/${params.locale}/estados`}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg backdrop-blur-sm"
              >
                {isEs ? "Ver guías por estado" : "Browse state guides"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTINGENCY BANNER ─── */}
      <section className="bg-green-50 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm sm:text-base font-medium text-green-800 flex items-center justify-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600 shrink-0" />
            {dict.home.contingencyBanner}
          </p>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900">
              {dict.home.howItWorks}
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { num: "1", icon: Users, title: dict.home.step1Title, desc: dict.home.step1Desc },
              { num: "2", icon: Scale, title: dict.home.step2Title, desc: dict.home.step2Desc },
              { num: "3", icon: Phone, title: dict.home.step3Title, desc: dict.home.step3Desc },
            ].map(({ num, icon: Icon, title, desc }) => (
              <div key={num} className="relative bg-gray-50 rounded-2xl p-8 text-center">
                <div className="w-14 h-14 bg-navy-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3 REASSURANCES ─── */}
      <section className="bg-navy-950 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:gap-12 sm:grid-cols-3">
            {/* No cost */}
            <div className="text-center sm:text-left">
              <div className="w-12 h-12 bg-green-400/10 rounded-xl flex items-center justify-center mx-auto sm:mx-0 mb-4">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{dict.home.noCostTitle}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{dict.home.noCostDesc}</p>
            </div>
            {/* Immigration */}
            <div className="text-center sm:text-left">
              <div className="w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center mx-auto sm:mx-0 mb-4">
                <Globe className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{dict.home.immigrationTitle}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{dict.home.immigrationDesc}</p>
            </div>
            {/* Spanish */}
            <div className="text-center sm:text-left">
              <div className="w-12 h-12 bg-sky-400/10 rounded-xl flex items-center justify-center mx-auto sm:mx-0 mb-4">
                <MessageCircle className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{dict.home.spanishTitle}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{dict.home.spanishDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATE GUIDES ─── */}
      <section className="bg-gray-50 py-16 sm:py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900">
              {dict.home.statesHeading}
            </h2>
            <p className="mt-3 text-gray-600 max-w-lg mx-auto">
              {dict.home.statesSubheading}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {states.map((s) => (
              <Link
                key={s.slug}
                href={`/${params.locale}/estados/${s.slug}`}
                className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-navy-200 hover:shadow-md transition-all"
              >
                <div className="text-2xl font-bold text-navy-900 mb-1">{s.code}</div>
                <div className="text-sm text-gray-600 group-hover:text-navy-700 transition-colors">{s.name}</div>
                <div className="mt-3 text-xs font-medium text-navy-900 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isEs ? "Ver guía" : "View guide"} <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MDX CONTENT (if exists — Spanish home) ─── */}
      {mdxContent && (
        <section className="bg-white py-16 sm:py-20 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-navy prose-lg max-w-none">
              {mdxContent}
            </div>
          </div>
        </section>
      )}

      {/* ─── TRUST / SOCIAL PROOF ─── */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-3 text-center">
            {[
              { value: "3.5x", label: isEs ? "más compensación con abogado" : "more compensation with a lawyer", source: "Insurance Research Council" },
              { value: isEs ? "Gratis" : "Free", label: isEs ? "La mayoría de abogados no cobran al inicio" : "Most lawyers charge nothing upfront", source: isEs ? "Honorarios de contingencia" : "Contingency fee basis" },
              { value: "2 min", label: isEs ? "para completar tu evaluación" : "to complete your evaluation", source: "" },
            ].map(({ value, label, source }) => (
              <div key={value} className="py-4">
                <div className="text-3xl sm:text-4xl font-bold text-navy-900">{value}</div>
                <p className="text-sm text-gray-600 mt-1">{label}</p>
                {source && <p className="text-xs text-gray-400 mt-1">{source}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section className="bg-navy-900 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            {dict.home.bottomCtaHeading}
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            {dict.home.bottomCtaText}
          </p>
          <div className="mt-8">
            <Link
              href={quizUrl(params.locale, { source: "home_bottom" })}
              className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-navy-950 font-bold px-10 py-4 rounded-xl transition-colors text-lg shadow-lg shadow-amber-400/20"
            >
              {dict.cta.freeEvaluation}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-400" /> {dict.home.trust1}</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-400" /> {dict.home.trust3}</span>
          </div>
        </div>
      </section>
    </>
  );
}
