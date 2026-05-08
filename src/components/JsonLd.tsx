import type { Locale } from "@/lib/i18n";

const baseUrl = "https://mvacompensation.com";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MVA Compensation",
    url: baseUrl,
    description: "Motor vehicle accident compensation information and attorney referral service.",
    areaServed: { "@type": "Country", name: "United States" },
    knowsLanguage: ["en", "es"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MVA Compensation",
    url: baseUrl,
    inLanguage: ["en", "es"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/en/estados/{search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface LegalServiceProps {
  locale: Locale;
}

export function LegalServiceJsonLd({ locale }: LegalServiceProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: "MVA Compensation",
    url: `${baseUrl}/${locale}`,
    description:
      locale === "es"
        ? "Información sobre compensación por accidentes de vehículos motorizados y evaluación gratuita de casos."
        : "Motor vehicle accident compensation information and free case evaluation.",
    serviceType: "Legal Information",
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    inLanguage: locale,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQPageProps {
  locale: Locale;
  faqs: FAQItem[];
}

export function FAQPageJsonLd({ locale, faqs }: FAQPageProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface ArticleJsonLdProps {
  locale: Locale;
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
}

export function ArticleJsonLd({
  locale,
  title,
  description,
  slug,
  datePublished,
  dateModified,
}: ArticleJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${baseUrl}/${locale}/${slug}`,
    inLanguage: locale,
    datePublished,
    dateModified: dateModified || datePublished,
    publisher: {
      "@type": "Organization",
      name: "MVA Compensation",
      url: baseUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
