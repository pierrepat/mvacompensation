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
    sameAs: [
      "https://www.youtube.com/@mvacompensation",
    ],
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
  section: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  authorCredential?: string;
  reviewerName?: string;
  reviewerCredential?: string;
  keywords?: string[];
  wordCount?: number;
}

export function ArticleJsonLd({
  locale,
  title,
  description,
  slug,
  section,
  datePublished,
  dateModified,
  authorName,
  authorCredential,
  reviewerName,
  reviewerCredential,
  keywords,
  wordCount,
}: ArticleJsonLdProps) {
  const data: Record<string, unknown> = {
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
    isPartOf: {
      "@type": "WebSite",
      name: "MVA Compensation",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/${locale}/${slug}`,
    },
  };

  if (authorName) {
    data.author = {
      "@type": "Person",
      name: authorName,
      ...(authorCredential && { jobTitle: authorCredential }),
    };
  }

  if (reviewerName) {
    data.reviewedBy = {
      "@type": "Person",
      name: reviewerName,
      ...(reviewerCredential && { jobTitle: reviewerCredential }),
    };
  }

  if (keywords && keywords.length > 0) {
    data.keywords = keywords.join(", ");
  }

  if (wordCount) {
    data.wordCount = wordCount;
  }

  if (section) {
    data.articleSection = section;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[]; locale: Locale }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href && { item: `${baseUrl}${item.href}` }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
