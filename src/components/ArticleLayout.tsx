import type { Locale } from "@/lib/i18n";
import type { BaseFrontmatter } from "@/lib/content-types";
import { Breadcrumbs } from "./Breadcrumbs";
import { AuthorBio } from "./AuthorBio";
import { LeadCaptureForm } from "./LeadCaptureForm";

interface ArticleLayoutProps {
  locale: Locale;
  meta: BaseFrontmatter;
  breadcrumbs: { label: string; href?: string }[];
  source?: string;
  stateCode?: string;
  children: React.ReactNode;
}

export function ArticleLayout({
  locale,
  meta,
  breadcrumbs,
  source,
  stateCode,
  children,
}: ArticleLayoutProps) {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Breadcrumbs items={breadcrumbs} />

      <h1 className="text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight leading-tight">
        {meta.title}
      </h1>

      <AuthorBio
        locale={locale}
        author={meta.author}
        reviewer={meta.reviewer}
        publishedAt={meta.publishedAt}
        lastUpdated={meta.lastUpdated}
      />

      <LeadCaptureForm locale={locale} variant="banner" source={source} stateCode={stateCode} />

      <div className="prose prose-navy prose-lg max-w-none">
        {children}
      </div>

      <LeadCaptureForm locale={locale} variant="banner" source={source} stateCode={stateCode} />
    </article>
  );
}
