import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import type { CityFrontmatter } from "@/lib/content-types";
import { getContentSlugs, getContentBySlug } from "@/lib/content";
import { renderMDX } from "@/lib/mdx";
import { ArticleLayout } from "@/components/ArticleLayout";
import { ArticleJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { RelatedLinks } from "@/components/RelatedLinks";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { extractFAQs } from "@/lib/extract-faqs";

// City pages are Spanish-only for now (keyword demand validated in es).
export async function generateStaticParams() {
  return getContentSlugs("es", "ciudades").map((ciudad) => ({
    locale: "es",
    ciudad,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; ciudad: string };
}): Promise<Metadata> {
  const slugs = getContentSlugs(params.locale, "ciudades");
  if (!slugs.includes(params.ciudad)) return {};

  const { meta } = getContentBySlug<CityFrontmatter>(
    params.locale,
    "ciudades",
    params.ciudad
  );

  const baseUrl = "https://mvacompensation.com";
  const url = `${baseUrl}/${params.locale}/ciudades/${params.ciudad}`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url, languages: { es: url } },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      type: "article",
      locale: params.locale,
      publishedTime: meta.publishedAt,
      modifiedTime: meta.lastUpdated,
      authors: [meta.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function CiudadPage({
  params,
}: {
  params: { locale: Locale; ciudad: string };
}) {
  const slugs = getContentSlugs(params.locale, "ciudades");
  if (!slugs.includes(params.ciudad)) {
    notFound();
  }

  const { meta, content } = getContentBySlug<CityFrontmatter>(
    params.locale,
    "ciudades",
    params.ciudad
  );

  const rendered = await renderMDX(content);

  const breadcrumbs = [
    { label: "Inicio", href: `/${params.locale}` },
    { label: "Ciudades", href: `/${params.locale}/ciudades` },
    {
      label: meta.state,
      href: `/${params.locale}/estados/${meta.parentStateSlug}`,
    },
    { label: meta.city },
  ];

  // Other cities, same state first, for hub-and-spoke internal linking.
  const allCities = getContentSlugs(params.locale, "ciudades")
    .filter((s) => s !== params.ciudad)
    .map((slug) => {
      const { meta: m } = getContentBySlug<CityFrontmatter>(
        params.locale,
        "ciudades",
        slug
      );
      return { slug, city: m.city, stateCode: m.stateCode };
    });
  const sameState = allCities.filter((c) => c.stateCode === meta.stateCode);
  const otherCities = [...sameState, ...allCities.filter((c) => c.stateCode !== meta.stateCode)]
    .slice(0, 6)
    .map((c) => ({
      title: `Abogado de accidentes en ${c.city}`,
      href: `/${params.locale}/ciudades/${c.slug}`,
    }));

  const faqs = extractFAQs(content);

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} locale={params.locale} />
      <ArticleJsonLd
        locale={params.locale}
        title={meta.title}
        description={meta.description}
        slug={`ciudades/${params.ciudad}`}
        section="Ciudades"
        datePublished={meta.publishedAt}
        dateModified={meta.lastUpdated}
        authorName={meta.author?.name}
        authorCredential={meta.author?.credential}
        reviewerName={meta.reviewer?.name}
        reviewerCredential={meta.reviewer?.credential}
        keywords={meta.keywords}
        wordCount={content.split(/\s+/).length}
      />
      {faqs.length > 0 && <FAQPageJsonLd locale={params.locale} faqs={faqs} />}

      <ArticleLayout
        locale={params.locale}
        meta={meta}
        breadcrumbs={breadcrumbs}
        source={`city_${params.ciudad}_${params.locale}`}
        stateCode={meta.stateCode}
      >
        {rendered}

        <LeadCaptureForm
          locale={params.locale}
          variant="inline"
          source={`city_${params.ciudad}_${params.locale}`}
          stateCode={meta.stateCode}
        />

        {otherCities.length > 0 && (
          <RelatedLinks
            locale={params.locale}
            heading="Abogados de accidentes en otras ciudades"
            links={otherCities}
          />
        )}

        <RelatedLinks
          locale={params.locale}
          heading={`Compensación en ${meta.state}`}
          links={[
            {
              title: `Guía de compensación en ${meta.state}`,
              href: `/${params.locale}/estados/${meta.parentStateSlug}`,
            },
            {
              title: "Calcula el valor de tu caso",
              href: `/${params.locale}/calculadora`,
            },
          ]}
        />
      </ArticleLayout>
    </>
  );
}
