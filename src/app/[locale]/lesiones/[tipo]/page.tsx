import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import type { InjuryFrontmatter } from "@/lib/content-types";
import { getContentSlugs, getContentBySlug } from "@/lib/content";
import { renderMDX } from "@/lib/mdx";
import { ArticleLayout } from "@/components/ArticleLayout";
import { ArticleJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { RelatedLinks } from "@/components/RelatedLinks";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { extractFAQs } from "@/lib/extract-faqs";

export async function generateStaticParams() {
  const esSlugs = getContentSlugs("es", "lesiones");
  const enSlugs = getContentSlugs("en", "lesiones");

  return [
    ...esSlugs.map((tipo) => ({ locale: "es", tipo })),
    ...enSlugs.map((tipo) => ({ locale: "en", tipo })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; tipo: string };
}): Promise<Metadata> {
  const slugs = getContentSlugs(params.locale, "lesiones");
  if (!slugs.includes(params.tipo)) return {};

  const { meta } = getContentBySlug<InjuryFrontmatter>(
    params.locale,
    "lesiones",
    params.tipo
  );

  const baseUrl = "https://mvacompensation.com";
  const url = `${baseUrl}/${params.locale}/lesiones/${params.tipo}`;
  const altLocale = params.locale === "en" ? "es" : "en";

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
      languages: {
        [params.locale]: url,
        [altLocale]: `${baseUrl}/${altLocale}/lesiones/${params.tipo}`,
        "x-default": `${baseUrl}/en/lesiones/${params.tipo}`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      type: "article",
      locale: params.locale,
      publishedTime: meta.publishedAt,
      modifiedTime: meta.lastUpdated,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function LesionPage({
  params,
}: {
  params: { locale: Locale; tipo: string };
}) {
  const slugs = getContentSlugs(params.locale, "lesiones");
  if (!slugs.includes(params.tipo)) notFound();

  const { meta, content } = getContentBySlug<InjuryFrontmatter>(
    params.locale,
    "lesiones",
    params.tipo
  );

  const rendered = await renderMDX(content);
  const isEn = params.locale === "en";

  const breadcrumbs = [
    { label: isEn ? "Home" : "Inicio", href: `/${params.locale}` },
    { label: isEn ? "Injuries" : "Lesiones", href: `/${params.locale}/lesiones` },
    { label: meta.title.split("|")[0].trim() },
  ];

  // Other injury links
  const allSlugs = getContentSlugs(params.locale, "lesiones");
  const otherInjuries = allSlugs
    .filter((s) => s !== params.tipo)
    .map((slug) => {
      const { meta: m } = getContentBySlug<InjuryFrontmatter>(params.locale, "lesiones", slug);
      return { title: m.title.split("|")[0].trim(), href: `/${params.locale}/lesiones/${slug}` };
    });

  // State links
  const stateSlugs = getContentSlugs(params.locale, "estados");
  const stateLinks = stateSlugs.slice(0, 5).map((slug) => {
    const { meta: m } = getContentBySlug(params.locale, "estados", slug);
    return { title: m.title.split("|")[0].trim(), href: `/${params.locale}/estados/${slug}` };
  });

  const faqs = extractFAQs(content);

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} locale={params.locale} />
      <ArticleJsonLd
        locale={params.locale}
        title={meta.title}
        description={meta.description}
        slug={`lesiones/${params.tipo}`}
        section={isEn ? "Injuries" : "Lesiones"}
        datePublished={meta.publishedAt}
        dateModified={meta.lastUpdated}
        authorName={meta.author?.name}
        authorCredential={meta.author?.credential}
        reviewerName={meta.reviewer?.name}
        reviewerCredential={meta.reviewer?.credential}
        keywords={meta.keywords}
        wordCount={content.split(/\s+/).length}
      />
      {faqs.length > 0 && (
        <FAQPageJsonLd locale={params.locale} faqs={faqs} />
      )}

      <ArticleLayout
        locale={params.locale}
        meta={meta}
        breadcrumbs={breadcrumbs}
        source={`injury_${params.tipo}_${params.locale}`}
      >
        {rendered}

        <LeadCaptureForm locale={params.locale} variant="inline" source={`injury_${params.tipo}_${params.locale}`} />

        {otherInjuries.length > 0 && (
          <RelatedLinks
            locale={params.locale}
            heading={isEn ? "Other Injury Guides" : "Otras guías de lesiones"}
            links={otherInjuries}
          />
        )}

        {stateLinks.length > 0 && (
          <RelatedLinks
            locale={params.locale}
            heading={isEn ? "State Guides" : "Guías por estado"}
            links={stateLinks}
          />
        )}
      </ArticleLayout>
    </>
  );
}
