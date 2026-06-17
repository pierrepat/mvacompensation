import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import type { GuideFrontmatter } from "@/lib/content-types";
import { getContentSlugs, getContentBySlug } from "@/lib/content";
import { renderMDX } from "@/lib/mdx";
import { ArticleLayout } from "@/components/ArticleLayout";
import { ArticleJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { RelatedLinks } from "@/components/RelatedLinks";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { extractFAQs } from "@/lib/extract-faqs";

export async function generateStaticParams() {
  const esSlugs = getContentSlugs("es", "guias");
  const enSlugs = getContentSlugs("en", "guias");
  return [
    ...esSlugs.map((tema) => ({ locale: "es", tema })),
    ...enSlugs.map((tema) => ({ locale: "en", tema })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; tema: string };
}): Promise<Metadata> {
  const slugs = getContentSlugs(params.locale, "guias");
  if (!slugs.includes(params.tema)) return {};
  const { meta } = getContentBySlug<GuideFrontmatter>(params.locale, "guias", params.tema);
  const baseUrl = "https://mvacompensation.com";
  const url = `${baseUrl}/${params.locale}/guias/${params.tema}`;
  const altLocale = params.locale === "en" ? "es" : "en";
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url, languages: { [params.locale]: url, [altLocale]: `${baseUrl}/${altLocale}/guias/${params.tema}`, "x-default": `${baseUrl}/en/guias/${params.tema}` } },
    openGraph: { title: meta.title, description: meta.description, url, type: "article", locale: params.locale, publishedTime: meta.publishedAt, modifiedTime: meta.lastUpdated },
  };
}

export default async function GuiaPage({
  params,
}: {
  params: { locale: Locale; tema: string };
}) {
  const slugs = getContentSlugs(params.locale, "guias");
  if (!slugs.includes(params.tema)) notFound();

  const { meta, content } = getContentBySlug<GuideFrontmatter>(params.locale, "guias", params.tema);
  const rendered = await renderMDX(content);
  const isEn = params.locale === "en";

  const breadcrumbs = [
    { label: isEn ? "Home" : "Inicio", href: `/${params.locale}` },
    { label: isEn ? "Guides" : "Guías", href: `/${params.locale}/guias` },
    { label: meta.title.split("|")[0].trim() },
  ];

  const otherGuides = getContentSlugs(params.locale, "guias")
    .filter((s) => s !== params.tema)
    .map((slug) => {
      const { meta: m } = getContentBySlug<GuideFrontmatter>(params.locale, "guias", slug);
      return { title: m.title.split("|")[0].trim(), href: `/${params.locale}/guias/${slug}` };
    });

  const stateSlugs = getContentSlugs(params.locale, "estados");
  const stateLinks = stateSlugs.slice(0, 5).map((slug) => {
    const { meta: m } = getContentBySlug(params.locale, "estados", slug);
    return { title: m.title.split("|")[0].trim(), href: `/${params.locale}/estados/${slug}` };
  });

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} locale={params.locale} />
      <ArticleJsonLd locale={params.locale} title={meta.title} description={meta.description} slug={`guias/${params.tema}`} section={isEn ? "Guides" : "Guías"} datePublished={meta.publishedAt} dateModified={meta.lastUpdated} authorName={meta.author?.name} authorCredential={meta.author?.credential} reviewerName={meta.reviewer?.name} reviewerCredential={meta.reviewer?.credential} keywords={meta.keywords} wordCount={content.split(/\s+/).length} />
      {(() => { const faqs = extractFAQs(content); return faqs.length > 0 ? <FAQPageJsonLd locale={params.locale} faqs={faqs} /> : null; })()}
      <ArticleLayout locale={params.locale} meta={meta} breadcrumbs={breadcrumbs} source={`guide_${params.tema}_${params.locale}`}>
        {rendered}
        <LeadCaptureForm locale={params.locale} variant="inline" source={`guide_${params.tema}_${params.locale}`} />
        {otherGuides.length > 0 && <RelatedLinks locale={params.locale} heading={isEn ? "More Guides" : "Más guías"} links={otherGuides} />}
        {stateLinks.length > 0 && <RelatedLinks locale={params.locale} heading={isEn ? "State Guides" : "Guías por estado"} links={stateLinks} />}
      </ArticleLayout>
    </>
  );
}
