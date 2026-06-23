import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import type { StateFrontmatter, CityFrontmatter } from "@/lib/content-types";
import { getContentSlugs, getContentBySlug } from "@/lib/content";
import { renderMDX } from "@/lib/mdx";
import { ArticleLayout } from "@/components/ArticleLayout";
import { ArticleJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { RelatedLinks } from "@/components/RelatedLinks";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { extractFAQs } from "@/lib/extract-faqs";

export async function generateStaticParams() {
  const esSlugs = getContentSlugs("es", "estados");
  const enSlugs = getContentSlugs("en", "estados");

  return [
    ...esSlugs.map((estado) => ({ locale: "es", estado })),
    ...enSlugs.map((estado) => ({ locale: "en", estado })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; estado: string };
}): Promise<Metadata> {
  const slugs = getContentSlugs(params.locale, "estados");
  if (!slugs.includes(params.estado)) return {};

  const { meta } = getContentBySlug<StateFrontmatter>(
    params.locale,
    "estados",
    params.estado
  );

  const baseUrl = "https://mvacompensation.com";
  const url = `${baseUrl}/${params.locale}/estados/${params.estado}`;
  const altLocale = params.locale === "en" ? "es" : "en";

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
      languages: {
        [params.locale]: url,
        [altLocale]: `${baseUrl}/${altLocale}/estados/${params.estado}`,
        "x-default": `${baseUrl}/en/estados/${params.estado}`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      type: "article",
      locale: params.locale,
      alternateLocale: altLocale,
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

export default async function EstadoPage({
  params,
}: {
  params: { locale: Locale; estado: string };
}) {
  const slugs = getContentSlugs(params.locale, "estados");
  if (!slugs.includes(params.estado)) {
    notFound();
  }

  const { meta, content } = getContentBySlug<StateFrontmatter>(
    params.locale,
    "estados",
    params.estado
  );

  const rendered = await renderMDX(content);

  const isEn = params.locale === "en";
  const breadcrumbs = [
    { label: isEn ? "Home" : "Inicio", href: `/${params.locale}` },
    {
      label: isEn ? "By State" : "Por Estado",
      href: `/${params.locale}/estados`,
    },
    { label: meta.title.split("|")[0].trim() },
  ];

  // Build related state links (other states)
  const allSlugs = getContentSlugs(params.locale, "estados");
  const otherStates = allSlugs
    .filter((s) => s !== params.estado)
    .map((slug) => {
      const { meta: m } = getContentBySlug<StateFrontmatter>(
        params.locale,
        "estados",
        slug
      );
      return {
        title: m.title.split("|")[0].trim(),
        href: `/${params.locale}/estados/${slug}`,
      };
    });

  // Cities in this state (hub-and-spoke internal linking aids crawl/indexation).
  const cityLinks = getContentSlugs(params.locale, "ciudades")
    .map((slug) => {
      const { meta: m } = getContentBySlug<CityFrontmatter>(
        params.locale,
        "ciudades",
        slug
      );
      return { slug, city: m.city, parentStateSlug: m.parentStateSlug };
    })
    .filter((c) => c.parentStateSlug === params.estado)
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
        slug={`estados/${params.estado}`}
        section={isEn ? "States" : "Estados"}
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
        source={`state_${params.estado}_${params.locale}`}
        stateCode={meta.stateCode}
      >
        {rendered}

        <LeadCaptureForm locale={params.locale} variant="inline" source={`state_${params.estado}_${params.locale}`} stateCode={meta.stateCode} />

        {cityLinks.length > 0 && (
          <RelatedLinks
            locale={params.locale}
            heading={
              isEn
                ? `Find a Lawyer by City in ${meta.title.split("|")[0].split(" en ").pop()?.trim() ?? ""}`
                : "Encuentra un abogado por ciudad"
            }
            links={cityLinks}
          />
        )}

        {otherStates.length > 0 && (
          <RelatedLinks
            locale={params.locale}
            heading={
              isEn ? "Other State Guides" : "Otras guías estatales"
            }
            links={otherStates}
          />
        )}

        <RelatedLinks
          locale={params.locale}
          heading={
            isEn
              ? "Common Accident Injuries"
              : "Lesiones comunes en accidentes"
          }
          links={[
            {
              title: isEn ? "Whiplash" : "Latigazo cervical",
              href: `/${params.locale}/lesiones/latigazo-cervical`,
            },
            {
              title: isEn
                ? "Traumatic Brain Injury"
                : "Lesión cerebral traumática",
              href: `/${params.locale}/lesiones/lesion-cerebral`,
            },
            {
              title: isEn ? "Fractures" : "Fracturas",
              href: `/${params.locale}/lesiones/fracturas`,
            },
            {
              title: isEn ? "Back & Spine Injuries" : "Lesiones de espalda",
              href: `/${params.locale}/lesiones/lesiones-de-espalda`,
            },
          ]}
        />
      </ArticleLayout>
    </>
  );
}
