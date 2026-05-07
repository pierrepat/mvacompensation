import type { Locale } from "@/lib/i18n";

interface AuthorBioProps {
  locale: Locale;
  author: { name: string; credential?: string; bio?: string };
  reviewer?: { name: string; credential: string };
  publishedAt: string;
  lastUpdated: string;
}

export function AuthorBio({
  locale,
  author,
  reviewer,
  publishedAt,
  lastUpdated,
}: AuthorBioProps) {
  const isEn = locale === "en";
  const pubDate = formatDate(publishedAt, locale);
  const updDate = formatDate(lastUpdated, locale);

  return (
    <div className="border-t border-b border-gray-200 py-4 my-6 text-sm text-gray-600">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span>
          {isEn ? "By" : "Por"}{" "}
          <strong className="text-gray-900">{author.name}</strong>
          {author.credential && (
            <span className="text-gray-500">, {author.credential}</span>
          )}
        </span>
        {reviewer && (
          <span className="flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-gray-400" />
            {isEn ? "Reviewed by" : "Revisado por"}{" "}
            <strong className="text-gray-900">{reviewer.name}</strong>
            <span className="text-gray-500">, {reviewer.credential}</span>
          </span>
        )}
      </div>
      <div className="flex gap-x-4 mt-1 text-xs text-gray-500">
        <span>
          {isEn ? "Published" : "Publicado"}: {pubDate}
        </span>
        {lastUpdated !== publishedAt && (
          <span>
            {isEn ? "Updated" : "Actualizado"}: {updDate}
          </span>
        )}
      </div>
    </div>
  );
}

function formatDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  return date.toLocaleDateString(locale === "es" ? "es-US" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
